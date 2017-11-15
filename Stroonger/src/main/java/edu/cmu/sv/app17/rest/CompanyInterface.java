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
import edu.cmu.sv.app17.models.Company;
import edu.cmu.sv.app17.models.Position;
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

@Path("company")
public class CompanyInterface {

    private MongoCollection<Document> companyCollection;
    private MongoCollection<Document> positionCollection;
    private ObjectWriter ow;


    public CompanyInterface() {
        MongoClient mongoClient = new MongoClient();
        MongoDatabase database = mongoClient.getDatabase("stroonger");
        this.companyCollection = database.getCollection("company");
        this.positionCollection = database.getCollection("position");
        ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
    }

    // Done
    @GET
    @Produces({ MediaType.APPLICATION_JSON})
    public APPListResponse getAllCompany(@DefaultValue("_default") @QueryParam("name") String nameArg,
                                         @DefaultValue("_default") @QueryParam("field") String fieldArg,
                                         @DefaultValue("_id") @QueryParam("sort") String sortArg,
                                         @DefaultValue("30") @QueryParam("count") int count,
                                         @DefaultValue("0") @QueryParam("offset") int offset) {

        ArrayList<Company> companyList = new ArrayList<Company>();

        try {
            BasicDBObject query = new BasicDBObject();

            if(! nameArg.equals("_default")) {
                query.put("name", nameArg);
            }
            if(! fieldArg.equals("_default")) {
                query.put("field", fieldArg);
            }

            BasicDBObject sortParams = new BasicDBObject();
            List<String> sortList = Arrays.asList(sortArg.split(","));
            sortList.forEach(sortItem -> {
                sortParams.put(sortItem,1);
            });

            long resultCount = companyCollection.count(query);
            FindIterable<Document> results = companyCollection.find(query).sort(sortParams).skip(offset).limit(count);
            for (Document item : results) {
                String comepanyName = item.getString("name");
                Company company = new Company(
                        comepanyName,
                        item.getString("description"),
                        item.getString("field"),
                        item.getString("location")
                );
                company.setId(item.getObjectId("_id").toString());
                companyList.add(company);
            }
            return new APPListResponse(companyList,resultCount,offset,companyList.size());

        } catch(APPBadRequestException e) {
            throw e;
        } catch(Exception e) {
            System.out.println("EXCEPTION!!!!");
            e.printStackTrace();
            throw new APPInternalServerException(99,e.getMessage());
        }

    }

    // Done
    @GET
    @Path("{id}")
    @Produces({MediaType.APPLICATION_JSON})
    public APPResponse getCompanyById(@PathParam("id") String id) {
        try {
            BasicDBObject query = new BasicDBObject();
            query.put("_id", new ObjectId(id));

            Document item = companyCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such company!");
            }
            Company company = new Company(
                    item.getString("name"),
                    item.getString("description"),
                    item.getString("field"),
                    item.getString("location")
            );
            company.setId(item.getObjectId("_id").toString());
            return new APPResponse(company);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0,"No such company!");
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        } catch(Exception e) {
            throw new APPInternalServerException(99,"Unexpected error");
        }

    }

    // Done
    @GET
    @Path("{id}/position")
    @Produces({MediaType.APPLICATION_JSON})
    public APPListResponse getAllPositionOfCompany(@PathParam("id") String companyid,
                                                   @DefaultValue("_default") @QueryParam("name") String nameArg,
                                                   @DefaultValue("_default") @QueryParam("type") String typeArg,
                                                   @DefaultValue("_id") @QueryParam("sort") String sortArg,
                                                   @DefaultValue("30") @QueryParam("count") int count,
                                                   @DefaultValue("0") @QueryParam("offset") int offset) {

        ArrayList<Position> positionList = new ArrayList<Position>();

        try {
            BasicDBObject query = new BasicDBObject();
            query.put("companyId", companyid);

            if(! nameArg.equals("_default")) {
                query.put("name", nameArg);
            }
            if(! typeArg.equals("_default")) {
                query.put("type", typeArg);
            }

            BasicDBObject sortParams = new BasicDBObject();
            List<String> sortList = Arrays.asList(sortArg.split(","));
            sortList.forEach(sortItem -> {
                sortParams.put(sortItem,1);
            });

            long resultCount = positionCollection.count(query);
            FindIterable<Document> results = positionCollection.find(query).sort(sortParams).skip(offset).limit(count);
            for (Document item : results) {
                String positionName = item.getString("name");
                Position position = new Position(
                        positionName,
                        item.getString("type"),
                        item.getString("description"),
                        item.getString("date"),
                        item.getString("location"),
                        item.getString("companyId")
                );
                position.setId(item.getObjectId("_id").toString());
                positionList.add(position);
            }
            return new APPListResponse(positionList, resultCount, offset, positionList.size());

        } catch(APPBadRequestException e) {
            throw e;
        } catch(Exception e) {
            System.out.println("EXCEPTION!!!!");
            e.printStackTrace();
            throw new APPInternalServerException(99,e.getMessage());
        }

    }

    /*-----------*/
    @GET
    @Path("{id}/position/{positionid}")
    @Produces({ MediaType.APPLICATION_JSON})
    public APPResponse getPositionOfCompanyById(@PathParam("id") String companyid,
                                                @PathParam("positionid") String positionid) {
        try {
            BasicDBObject query = new BasicDBObject();
            query.put("companyId", companyid);
            query.put("_id", new ObjectId(positionid));

            Document item = positionCollection.find(query).first();
            if (item == null) {
                throw new APPNotFoundException(0, "No such position!");
            }
            Position position = new Position(
                    item.getString("name"),
                    item.getString("type"),
                    item.getString("description"),
                    item.getString("date"),
                    item.getString("location"),
                    item.getString("companyId")
            );
            position.setId(item.getObjectId("_id").toString());
            return new APPResponse(position);

        } catch(APPNotFoundException e) {
            throw new APPNotFoundException(0, "No such position!");
        } catch(IllegalArgumentException e) {
            throw new APPBadRequestException(45,"Doesn't look like MongoDB ID");
        }  catch(Exception e) {
            throw new APPInternalServerException(99,"Something happened, pinch me!");
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
