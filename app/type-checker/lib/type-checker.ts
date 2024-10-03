type PrimitiveType = "string" | "number" | "boolean" | "undefined" | "null";
type ComplexType = "array" | "object" | "function";
type AllowedType = PrimitiveType | ComplexType;

export interface TypeDefinition {
  type: AllowedType;
  arrayType?: AllowedType;
  properties?: Record<string, TypeDefinition>;
}

export class TypeChecker {
  static checkType(value: any, typeDef: TypeDefinition): boolean {
    const actualType = TypeChecker.getType(value);

    if (actualType !== typeDef.type) {
      return false;
    }

    if (typeDef.type === "array" && Array.isArray(value)) {
      if (!typeDef.arrayType) return true;
      return value.every((item) =>
        TypeChecker.checkType(item, { type: typeDef.arrayType as AllowedType })
      );
    }

    if (typeDef.type === "object" && typeDef.properties) {
      return Object.entries(typeDef.properties).every(([key, propTypeDef]) =>
        TypeChecker.checkType(value[key], propTypeDef)
      );
    }

    return true;
  }

  private static getType(value: any): AllowedType {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (typeof value === "function") return "function";
    if (typeof value === "object") return "object";
    return typeof value as PrimitiveType;
  }
}

// 사용 예시
const personTypeDef: TypeDefinition = {
  type: "object",
  properties: {
    name: { type: "string" },
    age: { type: "number" },
    hobbies: { type: "array", arrayType: "string" },
    address: {
      type: "object",
      properties: {
        street: { type: "string" },
        city: { type: "string" },
      },
    },
  },
};

const person = {
  name: "John Doe",
  age: 30,
  hobbies: ["reading", "swimming"],
  address: {
    street: "123 Main St",
    city: "Anytown",
  },
};

console.log(TypeChecker.checkType(person, personTypeDef)); // true

const invalidPerson = {
  name: "Jane Doe",
  age: "25", // 잘못된 타입 (문자열 대신 숫자여야 함)
  hobbies: ["reading", 123], // 잘못된 배열 요소 타입
  address: {
    street: "456 Elm St",
    city: 42, // 잘못된 타입 (숫자 대신 문자열이어야 함)
  },
};

console.log(TypeChecker.checkType(invalidPerson, personTypeDef)); // false
