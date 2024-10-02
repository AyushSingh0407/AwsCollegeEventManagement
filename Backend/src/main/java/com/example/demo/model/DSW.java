package com.example.demo.model;

import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBTable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamoDBTable(tableName = "DSW")
public class DSW {

    private String dswCollegeName;
    private String dswCollegeEmail;
    private String dswMobileNo;
    private String dswPass
}
