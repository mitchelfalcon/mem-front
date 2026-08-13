/**
 * @description Controlador central para la orquestación del enjambre agéntico HERA,
 *              evaluación del umbral AUQ y despacho de transacciones DML / Webhooks.
 * @author      Equipo 20 - MEM Healthcare Network
 */
public with sharing class MEM_OrchestratorController {

    private static final Decimal AUQ_CRITICAL_THRESHOLD = 0.999;

    /**
     * @description Ejecuta la Unidad de Trabajo Agéntico (AWU) bloqueando reservas UCI en base de datos.
     */
    public static void executeUCIBedLockAWU(String hospitalAccountId, Integer bedsToLock) {
        List<Cama_UCI__c> availableBeds = [
            SELECT Id, Estado__c, Sede__c 
            FROM Cama_UCI__c 
            WHERE Estado__c = 'Disponible' 
            LIMIT :bedsToLock
            FOR UPDATE
        ];

        for (Cama_UCI__c bed : availableBeds) {
            bed.Estado__c = 'Ocupado - Reserva Epidemiológica MEM';
        }

        if (!availableBeds.isEmpty()) {
            update availableBeds;
            publishAuditPlatformEvent(0.9995, false, '[HASH_DP_AWU_COMMIT]');
        }
    }

    /**
     * @description Dispara una alerta externa por Webhook de Slack cuando el freno AUQ se activa.
     */
    @future(callout=true)
    public static void triggerSlackHumanInTheLoop(String accountId, Decimal quantileScore, Decimal auqScore) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Slack_MEM_Webhook_Credential');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');

        String slackPayload = '{"channel":"#mem-urgencias-epidemiologia",' +
            '"username":"MEM Healthcare — Gran Maestro AUQ",' +
            '"text":"🚨 ALERTA CRÍTICA: INCERTIDUMBRE AGÉNTICA DETECTADA.\\n' +
            '• Probabilidad Epidémica (p90): ' + quantileScore + '% (Alto Riesgo)\\n' +
            '• Confianza Agéntica (AUQ): ' + (auqScore * 100) + '% (Exigido: >= 99.9%)\\n' +
            '• Acción: Freno tanh Activado. Se requiere aprobación directiva manual."}';

        req.setBody(slackPayload);
        Http http = new Http();
        if (!Test.isRunningTest()) {
            http.send(req);
        }
        
        publishAuditPlatformEvent(auqScore, true, '[HASH_DP_883]');
    }

    private static void publishAuditPlatformEvent(Decimal auq, Boolean brake, String hash) {
        MEM_Clinical_Audit__e event = new MEM_Clinical_Audit__e(
            AUQ_Score__c = auq,
            Brake_Triggered__c = brake,
            DP_Hash__c = hash
        );
        EventBus.publish(event);
    }
}