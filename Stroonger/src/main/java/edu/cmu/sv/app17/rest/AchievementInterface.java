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
import edu.cmu.sv.app17.models.Achievement;
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

@Path("achievement")
public class AchievementInterface {

    private MongoCollection<Document> achievementCollection;
    private ObjectWriter ow;


    public AchievementInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.achievementCollection = database.getCollection("achievement");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }

    @GET
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getAllAcheievement() {

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
    }


    // Done
    @POST
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse createAchievement(Object request) {
        JSONObject json = null;
        try {
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
    }



    // Done
    @DELETE
    @Path("{id}")
    @Produces({ MediaType.APPLICATION_JSON})
    public Object deleteAchievement(@PathParam("id") String id) {
        try {

            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

            DeleteResult deleteResult = achievementCollection.deleteOne(query);

            if (deleteResult.getDeletedCount() < 1)
                throw new APPNotFoundException(66,"Could not delete");

            return new JSONObject();

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
