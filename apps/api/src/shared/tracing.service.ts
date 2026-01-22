import { Injectable } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-node';

@Injectable()
export class TracingService {
  private sdk: NodeSDK;

  constructor() {
    const resource = new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]:
        process.env.OTEL_SERVICE_NAME || 'restaurant-ar-api',
    });

    const traceExporter = process.env.OTEL_EXPORTER_OTLP_ENDPOINT
      ? new OTLPTraceExporter({
          url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
        })
      : new ConsoleSpanExporter();

    this.sdk = new NodeSDK({
      resource,
      traceExporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });
  }

  async start() {
    try {
      await this.sdk.start();
      console.log('OpenTelemetry tracing initialized');
    } catch (error) {
      console.error('Error initializing tracing', error);
    }
  }

  async shutdown() {
    try {
      await this.sdk.shutdown();
      console.log('OpenTelemetry tracing shut down');
    } catch (error) {
      console.error('Error shutting down tracing', error);
    }
  }
}
