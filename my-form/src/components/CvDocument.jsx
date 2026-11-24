import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer'
import { getCellValue } from './Table'

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: 'Helvetica' },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 22, fontWeight: 'bold' },
  image: { width: 70, height: 70, borderRadius: 35, objectFit: 'cover' },
  sectionTitle: { fontSize: 12, marginTop: 15, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: '#000', paddingBottom: 2, fontWeight: 'bold' },
  row: { flexDirection: 'row', marginBottom: 6, width: '50%' },
  label: { width: 100, fontWeight: 'bold', color: '#333' },
  value: { flex: 1 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#f0f0f0', padding: 5, borderBottomWidth: 1, borderBottomColor: '#000', fontWeight: 'bold' },
  tableRow: { flexDirection: 'row', padding: 5, borderBottomWidth: 1, borderBottomColor: '#ccc' },
})

export default function CvDocument({ profile, sections, baseFields }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerContainer}>
          <Text style={styles.name}>{profile.name || 'User'}</Text>

          {profile.profilePhotoPreview && <Image style={styles.image} src={profile.profilePhotoPreview} />}
        </View>

        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {baseFields.filter(f => f.name !== 'name').map(field => (
            <View style={styles.row} key={field.name}>
              <Text style={styles.label}>{field.label}:</Text>
              <Text style={styles.value}>{profile[field.name] || '-'}</Text>
            </View>
          ))}
        </View>

        {Object.entries(sections).map(([key, config]) => {
          if (!config.records || config.records.length === 0) return null
          return (
            <View key={key}>
              <Text style={styles.sectionTitle}>{config.title}</Text>
              <View style={styles.tableHeader}>
                {config.columns.map(col => (
                  <Text key={col.key} style={{ flex: 1, fontWeight: 'bold' }}>{col.label}</Text>
                ))}
              </View>
              {config.records.map(row => (
                <View style={styles.tableRow} key={row.id}>
                  {config.columns.map(col => (
                    <Text key={col.key} style={{ flex: 1 }}>{getCellValue(row.fields || {}, col)}</Text>
                  ))}
                </View>
              ))}
            </View>
          )
        })}
      </Page>
    </Document>
  )
}