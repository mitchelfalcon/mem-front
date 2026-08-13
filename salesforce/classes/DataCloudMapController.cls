/**
 * @description       : 
 * @author            : ChangeMeIn@UserSettingsUnder.SFDoc
 * @group             : 
 * @last modified on  : 08-05-2026
 * @last modified by  : ChangeMeIn@UserSettingsUnder.SFDoc
**/
public with sharing class DataCloudMapController {

    // Wrapper estructurado para tipado estricto en el LWC
    public class RegionMetricResponse {
        @AuraEnabled public String isoCode;
        @AuraEnabled public Decimal metricValue;
        @AuraEnabled public String stateName;
        @AuraEnabled public String indicatorType;
        @AuraEnabled public DateTime lastUpdated;
    }

    /**
     * Consulta inicial de métricas desde Data Cloud o base operativa
     * Cacheable para carga rápida del mapa al instanciar el DOM
     */
    @AuraEnabled(cacheable=true)
    public static List<RegionMetricResponse> getInitialRegionMetrics(String indicatorType) {
        List<RegionMetricResponse> responseList = new List<RegionMetricResponse>();
        
        try {
            // Validación de seguridad y sanitización de parámetro
            if (String.isBlank(indicatorType)) {
                throw new AuraHandledException('El tipo de indicador no puede estar vacío.');
            }

            // Consulta ejecutada en USER_MODE para respetar OLS/FLS
            // Sustituye 'Regional_Health_Metric__c' por tu objeto DMO/CIO mapeado
            List<SObject> records = [
                SELECT State_ISO_Code__c, Metric_Value__c, State_Name__c, LastModifiedDate
                FROM Regional_Health_Metric__c
                WHERE Indicator_Type__c = :indicatorType
                WITH USER_MODE
                ORDER BY State_ISO_Code__c ASC
            ];

            for (SObject row : records) {
                RegionMetricResponse item = new RegionMetricResponse();
                item.isoCode = (String) row.get('State_ISO_Code__c');
                item.metricValue = (Decimal) row.get('Metric_Value__c');
                item.stateName = (String) row.get('State_Name__c');
                item.indicatorType = indicatorType;
                item.lastUpdated = (DateTime) row.get('LastModifiedDate');
                responseList.add(item);
            }
        } catch (Exception e) {
            System.debug(LoggingLevel.ERROR, 'Error en DataCloudMapController: ' + e.getMessage());
            throw new AuraHandledException('Error cargando métricas espaciales: ' + e.getMessage());
        }

        return responseList;
    }
}