export class UrlConstants {

    // Controllers URL.
    public static readonly SENSORS_URL = 'http://localhost:3000/sensors';
    public static readonly RECORDS_URL = 'http://localhost:3000/records';
    public static readonly REPORTS_URL = 'http://localhost:3000/reports';
    public static readonly PROFILES_URL = 'http://localhost:3000/profiles';
    public static readonly ACCOUNTS_URL = 'http://localhost:3000/accounts';

    // Microservices health check URL (through Gateway.API).
    public static readonly GATEWAY_API_HC_URL = 'http://localhost:3000/hc';
    public static readonly SENSOR_API_HC_URL = 'http://localhost:3000/sensor.api/hc';
    public static readonly REPORT_API_HC_URL = 'http://localhost:3000/report.api/hc';
    public static readonly PROFILE_API_HC_URL = 'http://localhost:3000/profile.api/hc';
    public static readonly IDENTITY_API_HC_URL = 'http://localhost:3000/identity.api/hc';
    public static readonly DATAPROCESSOR_1_API_HC_URL = 'http://localhost:3000/dataprocessor_1.api/hc';
    public static readonly DATAPROCESSOR_2_API_HC_URL = 'http://localhost:3000/dataprocessor_2.api/hc';

    // DataSource health check URL.
    public static readonly DATASOURCE_1_API_HC_URL = 'http://localhost:3010/hc';
    public static readonly DATASOURCE_2_API_HC_URL = 'http://localhost:3011/hc';
}