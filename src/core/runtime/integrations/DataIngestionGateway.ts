export class DataIngestionGateway {
  /**
   * Gateway genérico que intercepta o recebimento físico do arquivo/JSON antes de qualquer motor.
   */
  static receivePayload(rawInput: any): any {
    // No MVP, nós não fazemos parsing de multipart/form-data ou buffers. 
    // Aceitamos o JSON e atestamos que passou pela alfândega.
    return rawInput;
  }
}
