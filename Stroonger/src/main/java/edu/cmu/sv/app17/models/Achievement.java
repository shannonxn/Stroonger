package edu.cmu.sv.app17.models;


public class Achievement {
     String id = null;
     String editor = null;
     String date = null;
     String company = null;
     String content = null;

    public Achievement(String editor, String date, String company, String content) {
        this.editor = editor;
        this.date = date;
        this.company = company;
        this.content = content;
    }
    public void setId(String id) {
        this.id = id;
    }
}
