package edu.cmu.sv.app17.models;

public class Resume {

    String id = null;
    String fileLink, versionName, uploadTime, ownerId;

    public Resume(String fileLink, String versionName, String uploadTime, String ownerId) {
        this.fileLink = fileLink;
        this.versionName = versionName;
        this.uploadTime = uploadTime;
        this.ownerId = ownerId;
    }
    public void setId(String id) {
        this.id = id;
    }
}
