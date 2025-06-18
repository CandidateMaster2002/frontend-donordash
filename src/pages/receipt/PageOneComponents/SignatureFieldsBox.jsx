// src/components/PageOneComponents/SignatureFieldsBox.jsx
import { View, Text, StyleSheet } from "@react-pdf/renderer";

const SignatureFieldsBox = ({
  height = 60,
  donorSignature = "",
  iskconSignature = "",
}) => {
  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 10,
    },
    fieldContainer: {
      width: "100%",
      height,
      borderWidth: 1,
      borderColor: "red",
      backgroundColor: "#eee",
      borderRadius: 4,
      paddingHorizontal: 12,
      justifyContent: "flex-end",
      position: "relative",
    },
    signatureText: {
      fontSize: 16,
      color: "#000",
    },
    bottomLabel: {
      position: "absolute",
      bottom: -10,
      backgroundColor: "#eee",
      paddingHorizontal: 6,
      fontSize: 10,
      color: "#023e7d",
      borderRadius: 4,
      // left: "50%",
      transform: "translateX(+100%)",
    },
  });

  const renderSignatureField = (label, value) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.signatureText}>{value || ""}</Text>
      <Text style={styles.bottomLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.rowContainer}>
      {/* {renderSignatureField("Donor Signature for Cash Payment", donorSignature)} */}
      {renderSignatureField("Signature of ISKCON Representative", iskconSignature)}
    </View>
  );
};

export default SignatureFieldsBox;
