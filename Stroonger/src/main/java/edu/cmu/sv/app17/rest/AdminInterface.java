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
import edu.cmu.sv.app17.models.*;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONException;
import org.json.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.text.SimpleDateFormat;
import java.util.*;

@Path("admin")
public class AdminInterface {

    private MongoCollection<Document> adminCollection;
    private MongoCollection<Document> companyCollection;
    private MongoCollection<Document> positionCollection;
    private MongoCollection<Document> candidateCollection;
    private MongoCollection<Document> resumeCollection;
    private MongoCollection<Document> headhunterCollection;
    private MongoCollection<Document> applicationCollection;
    private MongoCollection<Document> notificationCollection;
    private MongoCollection<Document> achievementCollection;
    private ObjectWriter ow;


    public AdminInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.adminCollection = database.getCollection("admin");
        this.companyCollection = database.getCollection("company");
        this.positionCollection = database.getCollection("position");
        this.candidateCollection = database.getCollection("candidate");
        this.resumeCollection = database.getCollection("resume");
        this.headhunterCollection = database.getCollection("headhunter");
        this.applicationCollection = database.getCollection("application");
        this.notificationCollection = database.getCollection("notification");
        this.achievementCollection = database.getCollection("achievement");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }

    /*-----Done------*/
    @GET
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllAdmin() {

        ArrayList<Admin> adminList = new ArrayList<Admin>();

        FindIterable<Document> results = adminCollection.find();
        if (results == null) {
            return new APPResponse(adminList);
        }
        for (Document item : results) {
            if(! item.getString("email").equals("stroonger@gmail.com")) {
                Admin admin = new Admin(
                        item.getString("email"),
                        item.getString("firstName"),
                        item.getString("lastName")
                );
                admin.setId(item.getObjectId("_id").toString());
                adminList.add(admin);
            }
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

    /*-----Done------*/
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



    // Done
    @GET
    @Path("{id}/resume")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllResume(@Context HttpHeaders headers, @PathParam("id") String id) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Resume> resumeList = new ArrayList<Resume>();
            BasicDBObject query = new BasicDBObject();
            FindIterable<Document> results = resumeCollection.find(query);

            for (Document item : results) {
                String fileLink = item.getString("fileLink");
                Resume resume = new Resume(
                        fileLink,
                        item.getString("versionName"),
                        item.getString("uploadTime"),
                        item.getString("ownerId")
                );
                resume.setId(item.getObjectId("_id").toString());
                resumeList.add(resume);
            }
            return new APPResponse(resumeList);

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
    @Path("{id}/resume/{resid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getOneResume(@Context HttpHeaders headers, @PathParam("id") String id,
                                    @PathParam("resid") String resid) {
        try {
            checkAuthentication(headers,id);
            BasicDBObject query = new BasicDBObject();

            query.put("_id", new ObjectId(resid));
            Document item = resumeCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such resume!");
            }
            Resume resume = new Resume(
                    item.getString("fileLink"),
                    item.getString("versionName"),
                    item.getString("uploadTime"),
                    item.getString("ownerId")
            );
            resume.setId(item.getObjectId("_id").toString());
            return new APPResponse(resume);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such resume!");
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }

    }



    // Done
    @GET
    @Path("{id}/headhunter")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPListResponse getAllHeadhunter(@Context HttpHeaders headers, @PathParam("id") String id,
                                            @DefaultValue("_default") @QueryParam("email") String emailArg,
                                            @DefaultValue("_id") @QueryParam("sort") String sortArg,
                                            @DefaultValue("30") @QueryParam("count") int count,
                                            @DefaultValue("0") @QueryParam("offset") int offset) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Headhunter> headhunterList = new ArrayList<Headhunter>();

            BasicDBObject query = new BasicDBObject();
            if(! emailArg.equals("_default")) {
                query.put("name", emailArg);
            }

            BasicDBObject sortParams = new BasicDBObject();
            List<String> sortList = Arrays.asList(sortArg.split(","));
            sortList.forEach(sortItem -> {
                sortParams.put(sortItem,1);
            });

            long resultCount = headhunterCollection.count(query);
            FindIterable<Document> results = headhunterCollection.find(query).sort(sortParams).skip(offset).limit(count);
            for (Document item : results) {
                String headhunterEmail = item.getString("email");
                Headhunter headhunter = new Headhunter(
                        headhunterEmail,
                        item.getString("firstName"),
                        item.getString("lastName"),
                        item.getString("gender"),
                        item.getString("age"),
                        item.getString("country"),
                        item.getString("state"),
                        item.getString("city"),
                        item.getString("zipCode"),
                        item.getString("mobile"),
                        item.getString("bankaccount"),
                        item.getString("routenumber")

                );
                headhunter.setId(item.getObjectId("_id").toString());
                headhunterList.add(headhunter);
            }
            return new APPListResponse(headhunterList,resultCount,offset,headhunterList.size());

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
    @Path("{id}/headhunter/{headid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getHeadhunterById(@Context HttpHeaders headers,
                                         @PathParam("id") String id, @PathParam("headid") String canid) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(canid));

            Document item = headhunterCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such headhunter!");
            }
            Headhunter headhunter = new Headhunter(
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
                    item.getString("bankaccount"),
                    item.getString("routenumber")
            );

            headhunter.setId(item.getObjectId("_id").toString());
            return new APPResponse(headhunter);

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



    // Done
    @GET
    @Path("{id}/position/{posid}/application")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllAppOfPosition(@Context HttpHeaders headers,
                                           @PathParam("id") String id, @PathParam("posid") String posid) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Application> applicationList = new ArrayList<Application>();
            BasicDBObject query = new BasicDBObject();
            query.put("positionId", posid);
            FindIterable<Document> results = applicationCollection.find(query);

            for (Document item : results) {
                String companyId = item.getString("companyId");
                Application application = new Application(
                        companyId,
                        item.getString("positionId"),
                        item.getString("userId"),
                        item.getString("resumeId"),
                        item.getString("userFN"),
                        item.getString("userLN"),
                        item.getString("posName"),
                        item.getString("comName"),
                        item.getString("applyDate"),
                        item.getString("statue"),
                        item.getBoolean("isHeadhunter")
                );
                application.setId(item.getObjectId("_id").toString());
                applicationList.add(application);
            }
            return new APPResponse(applicationList);

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
    @Path("{id}/position/{posid}/application/{appid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getOneApp(@Context HttpHeaders headers, @PathParam("id") String id,
                                 @PathParam("posid") String posid, @PathParam("appid") String appid) {
        try {
            checkAuthentication(headers,id);
            BasicDBObject query = new BasicDBObject();

            query.put("_id", new ObjectId(appid));
            Document item = applicationCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such Application!");
            }
            Application application = new Application(
                    item.getString("companyId"),
                    item.getString("positionId"),
                    item.getString("userId"),
                    item.getString("resumeId"),
                    item.getString("userFN"),
                    item.getString("userLN"),
                    item.getString("posName"),
                    item.getString("comName"),
                    item.getString("applyDate"),
                    item.getString("statue"),
                    item.getBoolean("isHeadhunter")
            );
            application.setId(item.getObjectId("_id").toString());
            return new APPResponse(application);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such application!");
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }

    }


    // Done
    @PATCH
    @Path("{id}/position/{posid}/application/{appid}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updateAppOfPosition(@Context HttpHeaders headers,
                                           @PathParam("id") String id,
                                           @PathParam("appid") String appid,
                                           Object request) {

        try {
            checkAuthentication(headers, id);

            JSONObject json = null;
            json = new JSONObject(ow.writeValueAsString(request));

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(appid));

            Document doc = new Document();
            if (json.has("statue"))
                doc.append("statue",json.getString("statue"));

            Document set = new Document("$set", doc);
            applicationCollection.updateOne(query,set);

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
    @POST
    @Path("{id}/notification")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createNotification(@Context HttpHeaders headers, @PathParam("id") String id, Object request) {
        JSONObject json = null;
        try {
            checkAuthentication(headers, id);

            json = new JSONObject(ow.writeValueAsString(request));

            FindIterable<Document> notification = notificationCollection.find();

            Date now = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yy");
            String curDate = sdf.format(now);

            Document doc = new Document("fromId", id)
                    .append("toId", json.getString("toId"))
                    .append("title", json.getString("title"))
                    .append("content", json.getString("content"))
                    .append("date", curDate)
                    .append("hasRead", false);

            notificationCollection.insertOne(doc);
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
    @GET
    @Path("{id}/notification")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllNotification(@Context HttpHeaders headers, @PathParam("id") String id) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Notification> notificationList = new ArrayList<Notification>();
            BasicDBObject query = new BasicDBObject();
            query.put("toId", "admin");

            FindIterable<Document> results = notificationCollection.find(query);

            for (Document item : results) {
                String fromId = item.getString("fromId");
                Notification notification = new Notification(
                        fromId,
                        item.getString("toId"),
                        item.getString("title"),
                        item.getString("content"),
                        item.getString("date"),
                        item.getBoolean("hasRead")
                );
                notification.setId(item.getObjectId("_id").toString());
                notificationList.add(notification);
            }

            return new APPResponse(notificationList);

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
    @Path("{id}/notification/{noid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getOneNoti(@Context HttpHeaders headers, @PathParam("id") String id,
                                  @PathParam("noid") String noid) {
        try {
            checkAuthentication(headers,id);
            BasicDBObject query = new BasicDBObject();

            query.put("_id", new ObjectId(noid));
            Document item = notificationCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such Notification!");
            }
            Notification notification = new Notification(
                    item.getString("fromId"),
                    item.getString("toId"),
                    item.getString("title"),
                    item.getString("content"),
                    item.getString("date"),
                    item.getBoolean("hasRead")
            );
            notification.setId(item.getObjectId("_id").toString());
            return new APPResponse(notification);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such application!");
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }

    }



    // Done
    @PATCH
    @Path("{id}/notification/{noid}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updateNotification(@Context HttpHeaders headers, @PathParam("id") String id,
                                          @PathParam("noid") String noid) {

        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(noid));

            Document doc = new Document();

            doc.append("hasRead", true);

            Document set = new Document("$set", doc);
            notificationCollection.updateOne(query,set);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

        return new APPResponse();
    }



    @GET
    @Path("{id}/achievement")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getAllAcheievement(@Context HttpHeaders headers, @PathParam("id") String id) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Achievement> achievementList = new ArrayList<Achievement>();

            FindIterable<Document> results = achievementCollection.find();
            if (results == null) {
                return new APPResponse(achievementList);
            }
            for (Document item : results) {
                Achievement acheievement = new Achievement(
                        item.getString("editor"),
                        item.getString("date"),
                        item.getString("company"),
                        item.getString("content")
                );
                acheievement.setId(item.getObjectId("_id").toString());
                achievementList.add(acheievement);
            }
            return new APPResponse(achievementList);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such achievement!");
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }
    }


    @GET
    @Path("{id}/achievement/{achid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getAchievementById(@Context HttpHeaders headers,
                                          @PathParam("id") String id, @PathParam("achid") String achid) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(achid));

            Document item = achievementCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such achievement!");
            }

            Achievement achievement = new Achievement(
                    item.getString("editor"),
                    item.getString("date"),
                    item.getString("company"),
                    item.getString("content")
            );

            achievement.setId(item.getObjectId("_id").toString());
            return new APPResponse(achievement);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such achievement!");
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
    @Path("{id}/achievement")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createAchievement(@Context HttpHeaders headers,
                                         @PathParam("id") String id, Object request) {

        try {
            checkAuthentication(headers, id);

            JSONObject json = null;
            json = new JSONObject(ow.writeValueAsString(request));

            if (!json.has("editor"))
                throw new APPBadRequestException(55,"missing editor");
            if (!json.has("company"))
                throw new APPBadRequestException(55,"missing company");
            if (!json.has("content"))
                throw new APPBadRequestException(55,"missing content");

            Date now = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yy");
            String curDate = sdf.format(now);

            Document doc = new Document("editor", json.getString("editor"))
                    .append("date", curDate)
                    .append("company", json.getString("company"))
                    .append("content", json.getString("content"));

            achievementCollection.insertOne(doc);
            return new APPResponse(request);
        }
        catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        }
        catch (APPBadRequestException e) {
            throw new APPBadRequestException(33, e.getMessage());
        }
        catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }
    };


    // Done
    @DELETE
    @Path("{id}/achievement/{achid}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Object deleteAchievement(@Context HttpHeaders headers,
                                    @PathParam("id") String id,
                                    @PathParam("achid") String achid) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(achid));

            DeleteResult deleteResult = achievementCollection.deleteOne(query);

            if (deleteResult.getDeletedCount() < 1)
                throw new APPNotFoundException(66,"Could not delete");

            return new JSONObject();

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
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
