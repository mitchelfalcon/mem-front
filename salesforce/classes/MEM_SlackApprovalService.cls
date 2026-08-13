/**
 * @description Endpoint Apex REST público/autenticado que procesa la respuesta del
 *              botón de Slack y desbloquea o descarta la AWU.
 */
@RestResource(urlMapping='/mem/v1/authorize/*')
global with sharing class MEM_SlackApprovalService {

    @HttpGet
    global static String handleSlackDecision() {
        RestRequest req = RestContext.request;
        String txId = req.params.get('tx');
        String action = req.params.get('action');
        String hospitalId = '001xx000003DGw2AAG'; // Sede Norte fallback

        if (action == 'APPROVE') {
            MEM_OrchestratorController.executeUCIBedLockAWU(hospitalId, 50);
            return '["ÉXITO": "AWU Aprobada por Director Médico. 50 Camas UCI Bloqueadas en red."]';
        } else {
            return '["RECHAZADO": "Alerta epidemiológica descartada. Se mantiene protocolo estacional."]';
        }
    }
}
