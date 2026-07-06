import { Kafka, Producer, Consumer } from 'kafkajs'
import { config } from '@geostream/config'

let kafka: Kafka
let producer: Producer

export function getKafka(): Kafka {
  if (!kafka) {
    kafka = new Kafka({
      clientId: 'geostream',
      brokers: config.kafkaBrokers,
    })
  }
  return kafka
}

export async function getProducer(): Promise<Producer> {
  if (!producer) {
    producer = getKafka().producer()
    await producer.connect()
  }
  return producer
}

export async function createConsumer(groupId: string): Promise<Consumer> {
  const consumer = getKafka().consumer({ groupId })
  await consumer.connect()
  return consumer
}
