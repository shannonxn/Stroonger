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
import edu.cmu.sv.app17.models.Admin;
import org.bson.Document;
import org.bson.types.ObjectId;
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
    private ObjectWriter ow;


    public AdminInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");

        this.adminCollection = database.getCollection("admin");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

    }


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

        }
        catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such candidate!");
        }
        catch(APPUnauthorizedException e) {
            throw e;
        }
        catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        }
        catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }


    }


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

    @DELETE
    @Path("{id}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Object delete(@PathParam("id") String id) {
        BasicDBObject query = new BasicDBObject();
        query.put("_id", new ObjectId(id));

        DeleteResult deleteResult = adminCollection.deleteOne(query);
        if (deleteResult.getDeletedCount() < 1)
            throw new APPNotFoundException(66,"Could not delete");

        return new JSONObject();
    }
}
