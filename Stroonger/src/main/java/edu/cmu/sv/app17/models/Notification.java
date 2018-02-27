package edu.cmu.sv.app17.models;


public class Notification {
     String id = null;
     String fromId, toId, title, content, date;
     Boolean hasRead;

    public Notification(String fromId, String toId, String title, String content, String date, Boolean hasRead) {
        this.fromId = fromId;
        this.toId = toId;
        this.title = title;
        this.content = content;
        this.date = date;
        this.hasRead = hasRead;
    }
    public void setId(String id) {
        this.id = id;
    }
}
