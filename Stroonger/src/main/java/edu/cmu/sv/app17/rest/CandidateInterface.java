package edu.cmu.sv.app17.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.result.DeleteResult;
import edu.cmu.sv.app17.exceptions.APPBadRequestException;
import edu.cmu.sv.app17.exceptions.APPInternalServerException;
import edu.cmu.sv.app17.exceptions.APPNotFoundException;
import edu.cmu.sv.app17.exceptions.APPUnauthorizedException;
import edu.cmu.sv.app17.helpers.APPCrypt;
import edu.cmu.sv.app17.helpers.APPResponse;
import edu.cmu.sv.app17.helpers.PATCH;
import edu.cmu.sv.app17.models.Candidate;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("candidate")
public class CandidateInterface {

    private MongoCollection<Document> candidateCollection;
    private MongoCollection<Document> resumeCollection;
    private ObjectWriter ow;


    public CandidateInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.candidateCollection = database.getCollection("candidate");
        this.resumeCollection = database.getCollection("resume");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }


    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getCandidateById(@Context HttpHeaders headers, @PathParam("id") String id) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

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


    @POST
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createCandidate(Object request) {
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
            if (!json.has("gender"))
                throw new APPBadRequestException(55,"missing gender");
            if (!json.has("age"))
                throw new APPBadRequestException(55,"missing age");
            if (!json.has("country"))
                throw new APPBadRequestException(55,"missing country");
            if (!json.has("state"))
                throw new APPBadRequestException(55,"missing state");
            if (!json.has("city"))
                throw new APPBadRequestException(55,"missing city");
            if (!json.has("zipCode"))
                throw new APPBadRequestException(55,"missing zipCode");
            if (!json.has("mobile"))
                throw new APPBadRequestException(55,"missing mobile");
            if (!json.has("currentTitle"))
                throw new APPBadRequestException(55,"missing currentTitle");
            if (!json.has("field"))
                throw new APPBadRequestException(55,"missing field");
            if (!json.has("selfIntroduction"))
                throw new APPBadRequestException(55,"missing selfIntroduction");

            Document doc = new Document("email", json.getString("email"))
                    .append("password", APPCrypt.encrypt(json.getString("password")))
                    .append("firstName", json.getString("firstName"))
                    .append("lastName", json.getString("lastName"))
                    .append("gender", json.getString("gender"))
                    .append("age", json.getString("age"))
                    .append("country", json.getString("country"))
                    .append("state", json.getString("state"))
                    .append("city", json.getString("city"))
                    .append("zipCode", json.getString("zipCode"))
                    .append("mobile", json.getString("mobile"))
                    .append("currentTitle", json.getString("currentTitle"))
                    .append("field", json.getString("field"))
                    .append("selfIntroduction", json.getString("selfIntroduction"));

            candidateCollection.insertOne(doc);
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
    }


    @PATCH
    @Path("{id}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updateCandidate(@Context HttpHeaders headers,
                                       @PathParam("id") String id,
                                       Object request) {

        try {
            checkAuthentication(headers, id);

            JSONObject json = null;
            json = new JSONObject(ow.writeValueAsString(request));

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

            int errorFlag = 0;

            Document doc = new Document();
            if (json.has("email")) {
                doc.append("email",json.getString("email"));
                errorFlag = 1;
            }
            if (json.has("password")) {
                doc.append("password", json.getString("password"));
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
            if (json.has("gender")) {
                doc.append("gender", json.getString("gender"));
                errorFlag = 1;
            }
            if (json.has("age")) {
                doc.append("age", json.getString("age"));
                errorFlag = 1;
            }
            if (json.has("country")) {
                doc.append("country", json.getString("country"));
                errorFlag = 1;
            }
            if (json.has("state")) {
                doc.append("state", json.getString("state"));
                errorFlag = 1;
            }
            if (json.has("city")) {
                doc.append("city", json.getString("city"));
                errorFlag = 1;
            }
            if (json.has("zipCode")) {
                doc.append("zipCode", json.getString("zipCode"));
                errorFlag = 1;
            }
            if (json.has("mobile")) {
                doc.append("mobile", json.getString("mobile"));
                errorFlag = 1;
            }
            if (json.has("currentTitle")) {
                doc.append("currentTitle", json.getString("currentTitle"));
                errorFlag = 1;
            }
            if (json.has("field")) {
                doc.append("field", json.getString("field"));
                errorFlag = 1;
            }
            if (json.has("selfIntroduction")) {
                doc.append("selfIntroduction", json.getString("selfIntroduction"));
                errorFlag = 1;
            }

            if(errorFlag == 0) {
                throw new APPBadRequestException(55,"The properties you want to update are wrong.");
            }

            Document set = new Document("$set", doc);
            candidateCollection.updateOne(query,set);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

        return new APPResponse();
    }


    @DELETE
    @Path("{id}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Object deleteCandidate(@Context HttpHeaders headers, @PathParam("id") String id) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

            DeleteResult deleteResult = candidateCollection.deleteOne(query);

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



    void checkAuthentication(HttpHeaders headers, String id) throws Exception{
        List<String> authHeaders = headers.getRequestHeader(HttpHeaders.AUTHORIZATION);
        if (authHeaders == null)
            throw new APPUnauthorizedException(70,"No Auhthorization Headers");
        String token = authHeaders.get(0);
        String clearToken = APPCrypt.decrypt(token);
        if (id.compareTo(clearToken) != 0) {
            throw new APPUnauthorizedException(71,"Invalid token. Please try getting a new token");
        }
    }
}
