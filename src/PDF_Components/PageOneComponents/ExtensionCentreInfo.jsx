// src/PDF_Components/PageOneComponents/ExtensionCentreInfo.jsx
import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffe566",
    border: "1 solid #d00000",
    width: "300px",
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  line: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: "center",
  },
});

const ExtensionCentreInfo = () => (
  <View style={styles.container}>
    <Text style={styles.line}>Extension Centre</Text>
    <Text style={styles.line}>
      Dhruv Singh Colony ,Rahargora , Dhaiya, Dhanbad, Jharkhand
    </Text>
    <Text style={styles.line}>PIN: 826004</Text>
    <Text style={styles.line}>Mobile No: 7644070770/9903013399</Text>
    <Text style={styles.line}>✉️ Email: acc.iskcondhanbad@gmail.com</Text>
  </View>
);

export default ExtensionCentreInfo;
