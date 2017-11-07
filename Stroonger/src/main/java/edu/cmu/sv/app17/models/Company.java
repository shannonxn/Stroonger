package edu.cmu.sv.app17.models;


public class Company {
     String id = null;
     String name, description, field, location;

    public Company(String companyName, String companyDescription, String companyField, String companyLocation) {
        this.name = companyName;
        this.description = companyDescription;
        this.field = companyField;
        this.location = companyLocation;
    }
    public void setId(String id) {
        this.id = id;
    }
}
