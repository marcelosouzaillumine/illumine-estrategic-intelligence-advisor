import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  section: {
    margin: 10,
    padding: 10,
    borderTop: '1px solid #334155',
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'var(--color-foreground)',
    marginBottom: 5,
    textTransform: 'uppercase'
  },
  subheader: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    color: '#64748b',
  },
  value: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'var(--color-foreground)',
  },
  warningBlock: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderLeft: '3px solid #ef4444',
    marginBottom: 8,
  },
  warningTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'var(--color-state-critical)',
  },
  warningText: {
    fontSize: 9,
    color: '#7f1d1d',
    marginTop: 2,
  },
  auditBlock: {
    marginTop: 10,
    paddingTop: 5,
    borderTop: '1px dotted #cbd5e1',
  },
  auditText: {
    fontSize: 8,
    color: 'var(--color-state-insufficient)',
    fontFamily: 'Courier',
  }
});

interface TemporalBoardPackSectionProps {
  temporalData: any; // Using any for simplicity in this dummy renderer, typically TemporalCausalityOutput
}

export const TemporalBoardPackSection: React.FC<TemporalBoardPackSectionProps> = ({ temporalData }) => {
  if (!temporalData || !temporalData.lineageHash) {
    return null; // Fail-closed sem lineage
  }

  // A UI de PDF *NÃO* pode gerar narrativa ou recalcular dados. Apenas renderizar (Regra 6).
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.header}>Temporal Causality & Governance Report</Text>
      <Text style={styles.subheader}>Official longitudinal assessment</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Temporal Governance Score</Text>
        <Text style={styles.value}>{temporalData.temporalGovernanceScore?.temporalGovernanceScore || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Recurrence Severity</Text>
        <Text style={styles.value}>{temporalData.predictiveRecurrence?.recurrenceSeverity || 'N/A'}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Escalation State</Text>
        <Text style={styles.value}>{temporalData.escalationState?.currentLevel || 'NORMAL'}</Text>
      </View>

      {temporalData.earlyWarnings && temporalData.earlyWarnings.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {temporalData.earlyWarnings.map((warning: any, idx: number) => (
            <View key={idx} style={styles.warningBlock}>
              <Text style={styles.warningTitle}>{warning.warningType.replace(/_/g, ' ')}</Text>
              <Text style={styles.warningText}>{warning.description}</Text>
            </View>
          ))}
        </View>
      )}

      {temporalData.causalChain && temporalData.causalChain.links && temporalData.causalChain.links.length > 0 && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Identified Causal Chain:</Text>
          {temporalData.causalChain.links.map((link: string, idx: number) => (
            <Text key={idx} style={{ fontSize: 9, color: '#334155', marginTop: 2 }}>• {link}</Text>
          ))}
        </View>
      )}

      <View style={styles.auditBlock}>
        <Text style={styles.auditText}>Lineage Hash: {temporalData.lineageHash}</Text>
        <Text style={styles.auditText}>Audit Ref: {temporalData.auditReference}</Text>
        <Text style={styles.auditText}>Correlation: {temporalData.correlationId}</Text>
      </View>
    </View>
  );
};
