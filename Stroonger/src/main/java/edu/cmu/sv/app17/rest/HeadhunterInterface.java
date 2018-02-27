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
import edu.cmu.sv.app17.helpers.APPResponse;
import edu.cmu.sv.app17.helpers.PATCH;
import edu.cmu.sv.app17.models.Application;
import edu.cmu.sv.app17.models.Headhunter;
import edu.cmu.sv.app17.models.Notification;
import edu.cmu.sv.app17.models.Resume;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.json.JSONObject;

import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Path("headhunter")
public class HeadhunterInterface {

    private MongoCollection<Document> headhunterCollection;
    private MongoCollection<Document> resumeCollection;
    private MongoCollection<Document> applicationCollection;
    private MongoCollection<Document> notificationCollection;
    private ObjectWriter ow;


    public HeadhunterInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.headhunterCollection = database.getCollection("headhunter");
        this.resumeCollection = database.getCollection("resume");
        this.applicationCollection = database.getCollection("application");
        this.notificationCollection = database.getCollection("notification");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }

    // Done

    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getHeadhunterById(@Context HttpHeaders headers, @PathParam("id") String id) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

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
            throw new APPNotFoundException(0,"No such headhunter!");
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
    public APPResponse createHeadhunter(Object request) {
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
            if (!json.has("bankaccount"))
                throw new APPBadRequestException(55,"missing bankaccount");
            if (!json.has("routenumber"))
                throw new APPBadRequestException(55,"missing routenumber");

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
                    .append("bankaccount", json.getString("bankaccount"))
                    .append("routenumber", json.getString("routenumber"));

            headhunterCollection.insertOne(doc);
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

    // Done
    @PATCH
    @Path("{id}")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse updateHeadhunter(@Context HttpHeaders headers,
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
            if (json.has("bankaccount")) {
                doc.append("bankaccount", json.getString("bankaccount"));
                errorFlag = 1;
            }
            if (json.has("routenumber")) {
                doc.append("routenumber", json.getString("routenumber"));
                errorFlag = 1;
            }

            if(errorFlag == 0) {
                throw new APPBadRequestException(55,"The properties you want to update are wrong.");
            }

            Document set = new Document("$set", doc);
            headhunterCollection.updateOne(query,set);

        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch(APPUnauthorizedException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }

        return new APPResponse();
    }

    /*-----No Need------*/
    @DELETE
    @Path("{id}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Object deleteHeadhunter(@Context HttpHeaders headers, @PathParam("id") String id) {
        try {
            checkAuthentication(headers, id);

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

            DeleteResult deleteResult = headhunterCollection.deleteOne(query);

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


    // Done
    @POST
    @Path("{id}/resume")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createResumeOfHeadhunter(@Context HttpHeaders headers, @PathParam("id") String id, Object request) {
        JSONObject json = null;
        try {
            checkAuthentication(headers, id);

            json = new JSONObject(ow.writeValueAsString(request));

            if (!json.has("fileLink"))
                throw new APPBadRequestException(55,"missing company fileLink");
            if (!json.has("versionName"))
                throw new APPBadRequestException(55,"missing company versionName");


            FindIterable<Document> results = resumeCollection.find();

            Date now = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yy");
            String curDate = sdf.format(now);

            Document doc = new Document("fileLink", json.getString("fileLink"))
                    .append("versionName", json.getString("versionName"))
                    .append("uploadTime", curDate)
                    .append("ownerId", id);

            resumeCollection.insertOne(doc);

            String resumeId = doc.getObjectId("_id").toString();

            return new APPResponse(resumeId);

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
    @Path("{id}/resume")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllResumeOfHeadhunter(@Context HttpHeaders headers, @PathParam("id") String id) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Resume> resumeList = new ArrayList<Resume>();
            BasicDBObject query = new BasicDBObject();
            query.put("ownerId", id);
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
    @POST
    @Path("{id}/application")
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createAppOfHeadhunter(@Context HttpHeaders headers, @PathParam("id") String id, Object request) {
        JSONObject json = null;
        try {
            checkAuthentication(headers, id);

            json = new JSONObject(ow.writeValueAsString(request));

            FindIterable<Document> application = applicationCollection.find();

            Date now = new Date();
            SimpleDateFormat sdf = new SimpleDateFormat("MM-dd-yy");
            String curDate = sdf.format(now);

            Document doc = new Document("companyId", json.getString("companyId"))
                    .append("positionId", json.getString("positionId"))
                    .append("userId", id)
                    .append("resumeId", json.getString("resumeId"))
                    .append("userFN", json.getString("userFN"))
                    .append("userLN", json.getString("userLN"))
                    .append("posName", json.getString("posName"))
                    .append("comName", json.getString("comName"))
                    .append("applyDate", curDate)
                    .append("statue", "In Progress")
                    .append("isHeadhunter", true);

            applicationCollection.insertOne(doc);
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
    @Path("{id}/application")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getAllAppOfHeadhunter(@Context HttpHeaders headers, @PathParam("id") String id) {

        try {
            checkAuthentication(headers, id);

            ArrayList<Application> applicationList = new ArrayList<Application>();
            BasicDBObject query = new BasicDBObject();
            query.put("userId", id);
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
    @Path("{id}/application/{appid}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getOneApp(@Context HttpHeaders headers, @PathParam("id") String id,
                                 @PathParam("appid") String appid) {
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
                    .append("toId", "admin")
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
            query.put("toId", id);

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
