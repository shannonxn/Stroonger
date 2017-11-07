package edu.cmu.sv.app17.rest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import edu.cmu.sv.app17.exceptions.APPBadRequestException;
import edu.cmu.sv.app17.exceptions.APPInternalServerException;
import edu.cmu.sv.app17.exceptions.APPNotFoundException;
import edu.cmu.sv.app17.helpers.APPCrypt;
import edu.cmu.sv.app17.helpers.APPResponse;
import edu.cmu.sv.app17.models.Admin;
import edu.cmu.sv.app17.models.adminSession;
import org.bson.Document;
import org.json.JSONObject;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("adminSessions")

public class adminSessionsInterface {

    private MongoCollection<Document> adminCollection;
    private ObjectWriter ow;


    public adminSessionsInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("app17-7");

        this.adminCollection = database.getCollection("admins");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();

    }


    @POST
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse create(Object request) {
        JSONObject json = null;
        try {
            json = new JSONObject(ow.writeValueAsString(request));
            if (!json.has("token"))
                throw new APPBadRequestException(55, "Account doesn't exist.");
            if (!json.has("password"))
                throw new APPBadRequestException(55, "missing password");
            BasicDBObject query = new BasicDBObject();

            query.put("token", json.getString("token"));
            query.put("password", APPCrypt.encrypt(json.getString("password")));

            Document item = adminCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No account found matching credentials");
            }
            Admin admin = new admin(
                    item.getString("firstName"),
                    item.getString("lastName"),
                    item.getString("email")
            );
            admin.setId(item.getObjectId("_id").toString());
            return new APPResponse(new adminSession(admin));
        }
        catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        }
        catch (APPBadRequestException e) {
            throw e;
        }
        catch (APPNotFoundException e) {
            throw e;
        }
        catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }
    }
}



