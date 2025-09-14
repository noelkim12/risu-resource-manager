// 바이너리 파일 생성을 돕는 클래스
export class BinaryWriter {
    private parts: Uint8Array[] = [];
    private totalLength = 0;
  
    public writeByte(value: number): void {
      const arr = new Uint8Array([value]);
      this.parts.push(arr);
      this.totalLength += arr.length;
    }
  
    public writeUInt32LE(value: number): void {
      const buffer = new ArrayBuffer(4);
      const view = new DataView(buffer);
      view.setUint32(0, value, true); // true for little-endian
      const arr = new Uint8Array(buffer);
      this.parts.push(arr);
      this.totalLength += arr.length;
    }
  
    public writeBytes(data: Uint8Array): void {
      this.parts.push(data);
      this.totalLength += data.length;
    }
  
    public toUint8Array(): Uint8Array {
      const result = new Uint8Array(this.totalLength);
      let offset = 0;
      for (const part of this.parts) {
        result.set(part, offset);
        offset += part.length;
      }
      return result;
    }
  }
  
  // 바이너리 파일 파싱을 돕는 클래스
  export class BinaryReader {
    private view: DataView;
    private offset = 0;
  
    constructor(buffer: ArrayBuffer) {
      this.view = new DataView(buffer);
    }
  
    public readByte(): number {
      const value = this.view.getUint8(this.offset);
      this.offset += 1;
      return value;
    }
  
    public readUInt32LE(): number {
      const value = this.view.getUint32(this.offset, true); // true for little-endian
      this.offset += 4;
      return value;
    }
  
    public readBytes(length: number): Uint8Array {
      const value = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length);
      this.offset += length;
      return value;
    }
    
    public eof(): boolean {
      return this.offset >= this.view.byteLength;
    }
  }