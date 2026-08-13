/**
 * @description Motor de trazabilidad clínica. El archivo original llegó vacío;
 *              esta implementación local cubre logAuditTrace usado por MEM_RAG_KnowledgeService.
 */
public with sharing class MEM_Audit_TraceEngine {

    public static void logAuditTrace(Id hospitalId, String actor, String note) {
        MEM_Clinical_Audit__e event = new MEM_Clinical_Audit__e(
            AUQ_Score__c = 0.985,
            Brake_Triggered__c = true,
            DP_Hash__c = '[HASH_DP_883]'
        );
        EventBus.publish(event);
        System.debug(
            LoggingLevel.INFO,
            'MEM_Audit_TraceEngine ' + hospitalId + ' actor=' + actor + ' note=' + note
        );
    }
}
