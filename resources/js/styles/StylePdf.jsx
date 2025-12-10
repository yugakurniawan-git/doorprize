import { StyleSheet } from "@react-pdf/renderer";
import { theme } from "./theme";

// Create styles
const StylePdf = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: '1cm 1.75cm',
    fontFamily: 'Halyard',
    fontSize: '10px',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    height: 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  studentInfoContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  leftColumn: {
    width: '55%',
    paddingRight: 10,
  },
  rightColumn: {
    width: '45%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  infoLabelLeft: {
    width: 90,
    fontSize: '10px',
  },
  infoLabelRight: {
    width: 80,
    fontSize: '10px',
  },
  infoColon: {
    width: 10,
    fontSize: '10px',
  },
  infoValue: {
    flex: 1,
    fontSize: '10px',
    textTransform: 'capitalize',
  },
  table: {
    marginTop: 15,
    border: '0.5px solid #000000',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
    backgroundColor: theme.colors.primary,
    color: '#ffffff',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000000',
  },
  tableFooter: {
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  cellTotalLabel: {
    width: '90%',
    textAlign: 'right',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    fontSize: '10px',
    paddingRight: 10,
  },
  cellNo: {
    width: '5%',
    textAlign: 'center',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    fontSize: '10px',
  },
  cellCode: {
    width: '15%',
    textAlign: 'center',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    fontSize: '10px',
  },
  cellCourse: {
    width: '70%',
    textAlign: 'left',
    padding: 5,
    borderRightWidth: 0.5,
    borderRightColor: '#000000',
    fontSize: '10px',
  },
  cellCredits: {
    width: '10%',
    textAlign: 'center',
    padding: 5,
    fontSize: '10px',
  },
  cellGrade: {
    width: '10%',
    textAlign: 'center',
    padding: 5,
    fontSize: '10px',
  },
  signatureContainer: {
    marginTop: 40,
    flexDirection: 'row',
  },
  signatureLeft: {
    width: '50%',
  },
  signatureRight: {
    width: '50%',
  },
  signatureText: {
    fontSize: '10px',
    marginBottom: 5,
    textAlign: 'right',
    lineHeight: 1.2,
  },
  signatureName: {
    fontSize: '10px',
    marginTop: 60,
    textAlign: 'right',
  },
  nidnText: {
    fontSize: '10px',
    textAlign: 'right',
  },
});

export default StylePdf;
