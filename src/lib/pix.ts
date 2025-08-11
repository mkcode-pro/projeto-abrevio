/**
 * Utilitário para gerar BR Code para PIX (Copia e Cola)
 * Baseado nas especificações do Banco Central do Brasil
 */

// Função para calcular o CRC16, essencial para a validação do BR Code
function crc16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    const byte = payload.charCodeAt(i);
    crc ^= (byte << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ polynomial;
      } else {
        crc <<= 1;
      }
    }
  }

  return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
}

// Função para formatar um campo do BR Code (ID + Tamanho + Valor)
function formatField(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

interface PixData {
  key: string;
  name?: string;
  city?: string;
  amount?: number;
  txid?: string;
}

/**
 * Gera o payload completo do BR Code para PIX
 */
export function generatePixCode({
  key,
  name = 'Abrev.io User',
  city = 'SAO PAULO',
  amount,
  txid = '***' // Transação única para pagamentos sem valor fixo
}: PixData): string {
  // Normaliza os dados
  const normalizedName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 25);
  const normalizedCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 15);

  // Monta o payload principal
  let payload = [
    formatField('00', '01'), // Payload Format Indicator
    formatField('26', 
      formatField('00', 'br.gov.bcb.pix') + // GUI
      formatField('01', key) // Chave PIX
    ),
    formatField('52', '0000'), // Merchant Category Code
    formatField('53', '986'), // Transaction Currency (BRL)
  ];

  // Adiciona o valor se for definido
  if (amount && amount > 0) {
    payload.push(formatField('54', amount.toFixed(2)));
  }

  payload.push(formatField('58', 'BR')); // Country Code
  payload.push(formatField('59', normalizedName)); // Merchant Name
  payload.push(formatField('60', normalizedCity)); // Merchant City
  payload.push(formatField('62', formatField('05', txid))); // Additional Data Field Template (TXID)

  // Finaliza com o CRC16
  const payloadString = payload.join('');
  const finalPayload = `${payloadString}6304`;
  const checksum = crc16(finalPayload);

  return `${finalPayload}${checksum}`;
}