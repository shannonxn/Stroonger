package edu.cmu.sv.app17.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import edu.cmu.sv.app17.exceptions.APPBadRequestException;
import edu.cmu.sv.app17.exceptions.APPInternalServerException;
import edu.cmu.sv.app17.exceptions.APPNotFoundException;
import edu.cmu.sv.app17.exceptions.APPUnauthorizedException;
import edu.cmu.sv.app17.helpers.APPCrypt;
import edu.cmu.sv.app17.helpers.APPListResponse;
import edu.cmu.sv.app17.helpers.APPResponse;
import edu.cmu.sv.app17.helpers.PATCH;
import edu.cmu.sv.app17.models.Admin;
import edu.cmu.sv.app17.models.Candidate;
import edu.cmu.sv.app17.models.Company;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Path("admin")
public class AdminInterface {

    private MongoCollection<Document> adminCollection;
    private MongoCollection<Document> companyCollection;
    private MongoCollection<Document> positionCollection;
    private MongoCollection<Document> candidateCollection;
    private ObjectWriter ow;


    public AdminInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.adminCollection = database.getCollection("admin");
        this.companyCollection = database.getCollection("company");
        this.positionCollection = database.getCollection("position");
        this.candidateCollection = database.getCollection("candidate");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }

    /*-----No Need------*/
    @GET
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllAdmin() {

        ArrayList<Admin> adminList = new ArrayList<Admin>();

        FindIterable<Document> results = adminCollection.find();
        if (results == null) {
            return new APPResponse(adminList);
        }
        for (Document item : results) {
            Admin admin = new Admin(
                    item.getString("email"),
                    item.getString("firstName"),
                    item.getString("lastName")
            );
            admin.setId(item.getObjectId("_id").toString());
            adminList.add(admin);
        }
        return new APPResponse(adminList);
    }

    // Done
    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getOneAdmin(@Context HttpHeaders headers, @PathParam("id") String id) {
        try {
            checkAuthentication(headers,id);
            BasicDBObject query = new BasicDBObject();

            query.put("_id", new ObjectId(id));
            Document item = adminCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such admin!");
            }
            Admin admin = new Admin(
                    item.getString("email"),
                    item.getString("firstName"),
                    item.getString("lastName")
            );
            admin.setId(item.getObjectId("_id").toString());
            return new APPResponse(admin);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such admin!");
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }

    }

    // Done
    @POST
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createAdmin(Object request) {
        JSONObject json = null;
        try {
            json = new JSONObject(ow.writeValueAsString(request));
            if (!json.has("email"))
                throw new APPBadRequestException(55,"missing email");
            if (!json.has("password"))
                throw new APPBadRequestException(55,"missing password");
            if (!json.has("firstName"))
                throw new APPBadRequestException(55,"missing firstName");
            if (!json.has("lastName"))
                throw new APPBadRequestException(55,"missing lastName");


            Document doc = new Document("email", json.getString("email"))
                    .append("password", APPCrypt.encrypt(json.getString("password")))
                    .append("firstName", json.getString("firstName"))
                    .append("lastName", json.getString("lastName"));

            adminCollection.insertOne(doc);
            return new APPResponse(request);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch (APPBadRequestException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }
    }

    // Done
    @PATCH
    @Path("{id}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updateAdmin(@Context HttpHeaders headers, @PathParam("id") String id, Object request) {
        try {
            checkAuthentication(headers,id);
            JSONObject json = null;
            json = new JSONObject(ow.writeValueAsString(request));
            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

            int errorFlag = 0;

            Document doc = new Document();
            if (json.has("email")) {
                doc.append("email", json.getString("email"));
                errorFlag = 1;
            }
            if (json.has("password")) {
                doc.append("password", APPCrypt.encrypt(json.getString("password")));
                errorFlag = 1;
            }
            if (json.has("firstName")) {
                doc.append("firstName", json.getString("firstName"));
                errorFlag = 1;
            }
            if (json.has("lastName")) {
                doc.append("lastName", json.getString("lastName"));
                errorFlag = 1;
            }

            if(errorFlag == 0) {
                throw new APPBadRequestException(55,"The properties you want to update are wrong.");
            }

            Document set = new Document("$set", doc);
            adminCollection.updateOne(query,set);

        } catch(JSONException e) {
            System.out.println("Failed to create a document");
        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new APPResponse();
    }

    /*-----No Need------*/
    @DELETE
    @Path("{id}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Object deleteAdmin(@PathParam("id") String id) {
        BasicDBObject query = new BasicDBObject();
        query.put("_id", new ObjectId(id));

        DeleteResult deleteResult = adminCollection.deleteOne(query);
        if (deleteResult.getDeletedCount() < 1)
            throw new APPNotFoundException(66,"Could not delete");

        return new JSONObject();
    }

    // Done
    @POST
    @Path("{id}/company")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createCompany(@Context HttpHeaders headers, @PathParam("id") String id, Object request) {
        JSONObject json = null;
        try {
            checkAuthentication(headers, id);

            json = new JSONObject(ow.writeValueAsString(request));

            if (!json.has("name"))
                throw new APPBadRequestException(55,"missing company name");
            if (!json.has("description"))
                throw new APPBadRequestException(55,"missing company description");
            if (!json.has("field"))
                throw new APPBadRequestException(55,"missing company field");
            if (!json.has("location"))
                throw new APPBadRequestException(55,"missing company location");


            FindIterable<Document> results = companyCollection.find();
            if (results != null) {
                for (Document item : results) {
                    if(item.getString("name").equals(json.getString("name"))) {
                        throw new APPBadRequestException(55,"This company already exists");
                    }
                }
            }

            Document doc = new Document("name", json.getString("name"))
                    .append("description", json.getString("description"))
                    .append("field", json.getString("field"))
                    .append("location", json.getString("location"));

            companyCollection.insertOne(doc);
            return new APPResponse(request);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

    }

    // Done
    @PATCH
    @Path("{id}/company/{companyid}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updateCompany(@Context HttpHeaders headers, @PathParam("id") String id, Object request,
                                     @PathParam("companyid") String companyid) {

        JSONObject json = null;

        try {
            checkAuthentication(headers, id);

            json = new JSONObject(ow.writeValueAsString(request));

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(companyid));

            Document doc = new Document();
            if (json.has("name"))
                doc.append("name",json.getString("name"));
            if (json.has("description"))
                doc.append("description", json.getString("description"));
            if (json.has("field"))
                doc.append("field",json.getString("field"));
            if (json.has("location"))
                doc.append("location",json.getString("location"));

            Document set = new Document("$set", doc);
            companyCollection.updateOne(query,set);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

        return new APPResponse();
    }

    // Done
    @DELETE
    @Path("{id}/company/{companyid}")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse deleteCompany(@Context HttpHeaders headers, @PathParam("id") String id,
                                     @PathParam("companyid") String companyid) {

        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(companyid));

            DeleteResult deleteResult = companyCollection.deleteOne(query);

            if (deleteResult.getDeletedCount() < 1)
                throw new APPNotFoundException(66,"Could not delete");

            return new APPResponse();

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

    }

    // Done
    @POST
    @Path("{id}/company/{companyid}/position")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse addPositionToCompany(@Context HttpHeaders headers,
                                            @PathParam("id") String id,
                                            @PathParam("companyid") String companyid,
                                            Object request) {
        try {
            checkAuthentication(headers, id);

            JSONObject json = null;
            json = new JSONObject(ow.writeValueAsString(request));
            if (!json.has("name"))
                throw new APPBadRequestException(55,"missing name");
            if (!json.has("type"))
                throw new APPBadRequestException(55,"missing type");
            if (!json.has("description"))
                throw new APPBadRequestException(55,"missing description");
            if (!json.has("date"))
                throw new APPBadRequestException(55,"missing date");
            if (!json.has("location"))
                throw new APPBadRequestException(55,"missing location");

            Document doc = new Document("name", json.getString("name"))
                    .append("type", json.getString("type"))
                    .append("description", json.getString("description"))
                    .append("date", json.getString("date"))
                    .append("location", json.getString("location"))
                    .append("companyId", companyid);

            positionCollection.insertOne(doc);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

        return new APPResponse();
    }

    // Done
    @PATCH
    @Path("{id}/company/{companyid}/position/{positionid}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updatePositionOfCompany(@Context HttpHeaders headers,
                                               @PathParam("id") String id,
                                               @PathParam("companyid") String companyid,
                                               @PathParam("positionid") String positionid,
                                               Object request) {

        try {
            checkAuthentication(headers, id);

            JSONObject json = null;
            json = new JSONObject(ow.writeValueAsString(request));

            BasicDBObject query = new BasicDBObject();
            query.put("companyId", companyid);
            query.put("_id", new ObjectId(positionid));

            Document doc = new Document();
            if (json.has("name"))
                doc.append("name",json.getString("name"));
            if (json.has("type"))
                doc.append("type",json.getString("type"));
            if (json.has("description"))
                doc.append("description", json.getString("description"));
            if (json.has("date"))
                doc.append("date", json.getString("date"));
            if (json.has("location"))
                doc.append("location",json.getString("location"));

            Document set = new Document("$set", doc);
            positionCollection.updateOne(query,set);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

        return new APPResponse();
    }

    // Done
    @DELETE
    @Path("{id}/company/{companyid}/position/{positionid}")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse deletePositionOfCompany(@Context HttpHeaders headers,
                                               @PathParam("id") String id,
                                               @PathParam("companyid") String companyid,
                                               @PathParam("positionid") String positionid) {

        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("companyId", companyid);
            query.put("_id", new ObjectId(positionid));

            DeleteResult deleteResult = positionCollection.deleteOne(query);

            if (deleteResult.getDeletedCount() < 1)
                throw new APPNotFoundException(66,"Could not delete");

            return new APPResponse();

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

    }

    // Done
    @GET
    @Path("{id}/candidate")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPListResponse getAllCandidate(@Context HttpHeaders headers, @PathParam("id") String id,
                                           @DefaultValue("_default") @QueryParam("email") String emailArg,
                                           @DefaultValue("_id") @QueryParam("sort") String sortArg,
                                           @DefaultValue("30") @QueryParam("count") int count,
                                           @DefaultValue("0") @QueryParam("offset") int offset) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Candidate> candidateList = new ArrayList<Candidate>();

            BasicDBObject query = new BasicDBObject();
            if(! emailArg.equals("_default")) {
                query.put("name", emailArg);
            }

            BasicDBObject sortParams = new BasicDBObject();
            List<String> sortList = Arrays.asList(sortArg.split(","));
            sortList.forEach(sortItem -> {
                sortParams.put(sortItem,1);
            });

            long resultCount = candidateCollection.count(query);
            FindIterable<Document> results = candidateCollection.find(query).sort(sortParams).skip(offset).limit(count);
            for (Document item : results) {
                String candidateEmail = item.getString("email");
                Candidate candidate = new Candidate(
                        candidateEmail,
                        item.getString("firstName"),
                        item.getString("lastName"),
                        item.getString("gender"),
                        item.getString("age"),
                        item.getString("country"),
                        item.getString("state"),
                        item.getString("city"),
                        item.getString("zipCode"),
                        item.getString("mobile"),
                        item.getString("currentTitle"),
                        item.getString("field"),
                        item.getString("selfIntroduction")
                );
                candidate.setId(item.getObjectId("_id").toString());
                candidateList.add(candidate);
            }
            return new APPListResponse(candidateList,resultCount,offset,candidateList.size());

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }




    }

    // Done
    @GET
    @Path("{id}/candidate/{canid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getCandidateById(@Context HttpHeaders headers,
                                        @PathParam("id") String id, @PathParam("canid") String canid) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(canid));

            Document item = candidateCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such candidate!");
            }
            Candidate candidate = new Candidate(
                    item.getString("email"),
                    item.getString("firstName"),
                    item.getString("lastName"),
                    item.getString("gender"),
                    item.getString("age"),
                    item.getString("country"),
                    item.getString("state"),
                    item.getString("city"),
                    item.getString("zipCode"),
                    item.getString("mobile"),
                    item.getString("currentTitle"),
                    item.getString("field"),
                    item.getString("selfIntroduction")
            );

            candidate.setId(item.getObjectId("_id").toString());
            return new APPResponse(candidate);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such candidate!");
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }


    }




    private void checkAuthentication(HttpHeaders headers, String id) throws Exception{
        List<String> authHeaders = headers.getRequestHeader(HttpHeaders.AUTHORIZATION);
        if (authHeaders == null)
            throw new APPUnauthorizedException(70, "No Auhthorization Headers");
        String token = authHeaders.get(0);
        String clearToken = APPCrypt.decrypt(token);
        if (id.compareTo(clearToken) != 0) {
            throw new APPUnauthorizedException(71, "Invalid token. Please try getting a new token");
        }
    }
}
