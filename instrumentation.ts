/*

Resources
- https://github.com/adityasinghcodes/nextjs-monitoring/blob/main/instrumentation.ts
- OTEL metrics: https://opentelemetry.io/docs/languages/js/instrumentation/#metrics

*/

import opentelemetry from '@opentelemetry/api';
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import {
  defaultResource,
  resourceFromAttributes,
} from '@opentelemetry/resources';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    console.log("Lifecycle Nextjs App");

    // Get hostname from environment or use 'local' as fallback
    const hostname = process.env.HOSTNAME || 'local';

    // Create resource with service metadata
    const resource = defaultResource().merge(
      resourceFromAttributes({
        [ATTR_SERVICE_NAME]: 'nextjs-app',
        // [ATTR_SERVICE_VERSION]: '0.1.0',
        'host.name': hostname,
      }),
    );

    // Configure OTLP Metrics Exporter with GRPC
    const metricExporter = new OTLPMetricExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    });

    // Create periodic exporter
    const metricReader = new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 15000, // Export metrics every 15 seconds
    });

    // Create and set global MeterProvider
    const meterProvider = new MeterProvider({
      resource: resource,
      readers: [metricReader],
    });
    // Other approach: new NodeSDK({})

    opentelemetry.metrics.setGlobalMeterProvider(meterProvider);
    console.log('OpenTelemetry Metrics Provider initialized with GRPC exporter');
  }
}

