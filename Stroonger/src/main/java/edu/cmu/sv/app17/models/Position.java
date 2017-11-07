package edu.cmu.sv.app17.models;

public class Position {

    String id = null;
    String name, type, description, date, location;
    String companyId;

    public Position(String name, String type, String description, String date, String location, String companyId) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.date = date;
        this.location = location;
        this.companyId = companyId;
    }
    public void setId(String id) {
        this.id = id;
    }
}
