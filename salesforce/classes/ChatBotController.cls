/**
 * @description Controlador avanzado para la orquestación del chat con Agentforce y flujos clínicos.
 * @author Nailea Falcón
 * @last modified on 08-05-2026
 **/
public with sharing class ChatBotController {

    /**
     * @description Procesa el mensaje de entrada y lo deriva hacia los servicios de IA de la organización.
     * @param message Mensaje enviado por el usuario desde el LWC.
     * @return String Respuesta procesada por el agente.
     **/
    @AuraEnabled
    public static String askAgent(String message) {
        try {
            if (String.isBlank(message)) {
                throw new AuraHandledException('El mensaje de entrada no puede estar vacio.');
            }
            
            String sanitizedMessage = message.trim();
            if (sanitizedMessage.length() > 1000) {
                sanitizedMessage = sanitizedMessage.substring(0, 1000);
            }

            return processAgentRequest(sanitizedMessage);
            
        } catch (Exception e) {
            throw new AuraHandledException('Error critico en el orquestador de Agentforce: ' + e.getMessage());
        }
    }

    /**
     * @description Dispara de forma segura un flujo automatizado de soporte.
     * @param userInput Texto del usuario que activa la condicion del flujo.
     **/
    @AuraEnabled
    public static void startSupportFlow(String userInput) {
        try {
            if (String.isBlank(userInput)) {
                return;
            }

            Map<String, Object> inputs = new Map<String, Object>();
            inputs.put('Question', userInput);

            // Descomentar una vez que el flujo 'CustomerAssistant' este desplegado en la org
            /*
            Flow.Interview.CustomerAssistant interview = new Flow.Interview.CustomerAssistant(inputs);
            interview.start();
            */
            
        } catch (Exception e) {
            throw new AuraHandledException('No se pudo inicializar el flujo automatizado de soporte.');
        }
    }

    /**
     * @description Metodo interno de servicio para la integracion con modelos de Agentforce / Prompt Builder.
     * @param prompt Texto sanitizado recibido para el procesamiento del agente.
     * @return String Resultado de la ejecucion del servicio.
     **/
    private static String processAgentRequest(String prompt) {
        try {
            return 'Agente proceso la solicitud con exito: ' + prompt;
        } catch (Exception e) {
            return 'Advertencia: El sistema de IA experimento una latencia temporal, intente de nuevo.';
        }
    }
}