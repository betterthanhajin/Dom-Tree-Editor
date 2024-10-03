import { TypeChecker, TypeDefinition } from "./lib/type-checker";

export default function Page() {
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

  return (
    <div>
      <h1>Type Checker</h1>
      <p>
        This is a simple type checker that can check if a given value matches a
        specified type definition.
      </p>
      <h2>Usage</h2>
      <p>{person.name}</p>
    </div>
  );
}
