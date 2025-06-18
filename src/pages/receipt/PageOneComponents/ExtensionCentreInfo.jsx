// src/components/PageOneComponents/ExtensionCentreInfo.jsx
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
      Sri Sri Jagannath Temple, First floor Ashar Sapphire, Kolshet Road, Thane (W)
    </Text>
    <Text style={styles.line}>PIN: 400607*</Text>
    <Text style={styles.line}>Mobile: 8419990081</Text>
    <Text style={styles.line}>E-mail: revatiramanlns@gmail.com</Text>
  </View>
);

export default ExtensionCentreInfo;
