export const exitHandler = (code: number): never => {
    console.log(`Exit handler called with code ${code}`);
    process.exit(code);
  };
  