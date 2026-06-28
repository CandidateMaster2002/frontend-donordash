// src/PDF_Components/PageOneComponents/SignatureFieldsBox.jsx
import { View, Text, StyleSheet, Image } from '@react-pdf/renderer';
import bhimSign from '../../assets/signature_images/bhim_sign.png';
import dgpSign from '../../assets/signature_images/dgp_sign.png';
import nppSign from '../../assets/signature_images/npp_sign.png';
import sunitaSign from '../../assets/signature_images/sunita_sign.png';
import nibeditaSign from '../../assets/signature_images/nibedita_sign.png';
import rajeevSign from '../../assets/signature_images/rajeev_sign.png';
import sumanPrSign from '../../assets/signature_images/suman_sign.png';
import spapSign from '../../assets/signature_images/spap_sign.png';

const getSignatureByDonorCultivatorId = (id) => {
  switch (String(id)) {
    case '1':
      return sunitaSign;
    case '2':
      return bhimSign;
    case '3':
      return rajeevSign;
    case '4':
      return spapSign;
    case '5':
      return dgpSign;
    case '6':
      return nibeditaSign;
    case '7':
      return sumanPrSign;
    case '8':
      return nppSign;
    case '9':
      return nppSign;
    case '420':
      return nppSign;
    default:
      return bhimSign; // fallback
  }
};

const SignatureFieldsBox = ({ height = 60, donorCultivatorId = '8' }) => {
  const styles = StyleSheet.create({
    rowContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 10,
    },
    fieldContainer: {
      width: '100%',
      height,
      borderWidth: 1,
      borderColor: 'red',
      backgroundColor: '#eee',
      borderRadius: 4,
      paddingHorizontal: 12,
      justifyContent: 'center', // vertically center image
      alignItems: 'center', // horizontally center image
      position: 'relative',
    },

    signatureText: {
      fontSize: 8,
      color: '#000',
    },
    bottomLabel: {
      position: 'absolute',
      bottom: -10,
      backgroundColor: '#eee',
      paddingHorizontal: 6,
      fontSize: 10,
      color: '#023e7d',
      borderRadius: 4,
      // left: "50%",
      transform: 'translateX(+100%)',
    },
  });

  const renderSignatureField = (label, value) => (
    <View style={styles.fieldContainer}>
      {value ? (
        <Image src={value} style={{ width: '75%', objectFit: 'contain' }} />
      ) : null}
      <Text style={styles.bottomLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.rowContainer}>
      {/* {renderSignatureField("Donor Signature for Cash Payment", donorSignature)} */}
      {renderSignatureField(
        'Signature of ISKCON Representative',
        getSignatureByDonorCultivatorId(donorCultivatorId)
      )}
    </View>
  );
};

export default SignatureFieldsBox;
