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
import edu.cmu.sv.app17.models.Candidate;
import edu.cmu.sv.app17.models.CandidateSession;
import org.bson.Document;
import org.json.JSONObject;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("candidateSession")

public class CandidateSessionsInterface {

    private MongoCollection<Document> candidateCollection;
    private ObjectWriter ow;


    public CandidateSessionsInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.candidateCollection = database.getCollection("candidate");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }


    @POST
    @Consumes({ MediaType.APPLICATION_JSON})
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse create( Object request) {
        JSONObject json = null;
        try {
            json = new JSONObject(ow.writeValueAsString(request));
            if (!json.has("email"))
                throw new APPBadRequestException(55, "missing email");
            if (!json.has("password"))
                throw new APPBadRequestException(55, "missing password");

            BasicDBObject query = new BasicDBObject();

            query.put("email", json.getString("email"));
            query.put("password", APPCrypt.encrypt(json.getString("password")));

            Document item = candidateCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No candidate found matching credentials");
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
            return new APPResponse(new CandidateSession(candidate));
        } catch (JsonProcessingException e) {
            throw new APPBadRequestException(33, e.getMessage());
        } catch (APPBadRequestException e) {
            throw e;
        } catch (Exception e) {
            throw new APPInternalServerException(0, e.getMessage());
        }
    }


}



