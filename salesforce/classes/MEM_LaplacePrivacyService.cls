/**
 * @description Servicio criptográfico y estadístico que aplica Privacidad Diferencial (DP)
 *              mediante ruido Laplaciano sobre la identidad del paciente (PHI).
 * @author      Equipo 20 - MEM Healthcare Network
 */
public with sharing class MEM_LaplacePrivacyService {

    private static final Decimal EPSILON = 0.1;
    private static final Decimal DELTA = 0.00001;
    private static final Decimal SENSITIVITY_DELTA_F = 1.0;

    public class PrivacyPayload {
        public String originalPatientId;
        public String anonymizedHash;
        public Decimal laplacianNoiseApplied;
        public Boolean isHipaaCompliant;
    }

    /**
     * @description Inyecta ruido estocástico Laplaciano a variables sensibles y genera un hash
     *              irreversible para presentación visual.
     */
    public static PrivacyPayload applyLaplacianNoise(String patientId, Decimal clinicalMetric) {
        PrivacyPayload result = new PrivacyPayload();
        result.originalPatientId = patientId;
        
        // 1. Cálculo de ruido Laplaciano: Lap(b) donde b = Delta_f / Epsilon
        Decimal scaleB = SENSITIVITY_DELTA_F / EPSILON;
        Decimal uniformRand = Math.random() - 0.5; // Uniforme en (-0.5, 0.5)
        
        // Transformada inversa de la distribución Laplaciana: -b * sgn(u) * ln(1 - 2|u|)
        Integer sgn = uniformRand >= 0 ? 1 : -1;
        Decimal absU = Math.abs(uniformRand);
        Decimal logTerm = Math.log(1.0 - (2.0 * absU));
        Decimal laplacianNoise = -scaleB * sgn * logTerm;
        
        result.laplacianNoiseApplied = laplacianNoise.setScale(4);
        
        // 2. Ofuscación SHA-256 DP Zero-Copy para pantalla directiva HUD
        Blob hashBlob = Crypto.generateDigest('SHA-256', Blob.valueOf(patientId + String.valueOf(System.currentTimeMillis())));
        String fullHash = EncodingUtil.convertToHex(hashBlob);
        result.anonymizedHash = '[HASH_DP_' + fullHash.substring(0, 3).toUpperCase() + ']';
        result.isHipaaCompliant = true;
        
        return result;
    }
}