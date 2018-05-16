/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */

const ADD = 0b10101000;
const AND = 0b10110011;
const CALL = 0b001001000;
const CMP = 0b10100000;
const DEC = 0b001111001;
const HLT = 0b00000001;
const INC = 0b001111000;
const INT = 0b001001010;
const IRET = 0b000001011;
const JEQ = 0b001010001;
const JGT = 0b001010100;
const JLT = 0b001010011;
const JMP = 0b001010000;
const JNE = 0b001010010;
const LD = 0b10011000;
const LDI = 0b10011001;
const MOD = 0b10101100;
const MUL = 0b10101010;
const NOP = 0b00000000;
const NOT = 0b001110000;
const OR = 0b10110001;
const POP = 0b001001100;
const PRA = 0b001000010; 
const PRN = 0b01000011; 
const PUSH = 0b001001101; 
const RET = 0b00001001;
const ST = 0b10011010;
const SUB = 0b10101001;
const XOR = 0b10110010; 


class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7
        
        // Special-purpose registers
        this.PC = 0; // Program Counter
        this.MAR = 0;
        this.MDR = 0;
        this.FL = 0;
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
      let num1 = this.reg[regA];
      let num2 = this.reg[regB];

        switch (op) {
            case 'ADD':
              this.reg[regA] = num1 + num2;
              break;
            case 'SUB':
              this.reg[regA] = num1 - num2;
              break;
            case 'MUL':
              this.reg[regA] = num1 * num2;
              break;
            case 'DIV':
              this.reg[regA] = num1 / num2;
              break;
            case 'INC':
              this.reg[regA] = num1++;
              break;
            case 'DEC':
              this.reg[regA] = num1--;
              break;
            case 'CMP':
              num1 > num2 ? this.flag = parseInt(2, 2)
              : num1 < num2 ? this.flag = parseInt(4, 2)
              : this.flag = parseInt(1, 2);
              break;
            default:
              this.hlt();
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {

        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)

        let IR = this.ram.read(this.PC);
        
        // Debugging output
        console.log(`${this.PC}: ${IR.toString(2)}`);


        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        let operandA = this.ram.read(this.PC + 1);
        let operandB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.
        switch (IR) {
          case LDI:
            this.reg[operandA] = operandB;
            break;
          case PRN:
            console.log(this.reg[operandA]);
            break;
          case HLT:
            this.stopClock();
            break;
          case ADD:
            this.alu("ADD", this.reg[operandA], this.reg[operandB]);
            break;
          case MUL:
            this.alu("MUL", operandA, operandB);
            break;
          default:
            this.stopClock();
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        this.PC += (IR >> 6) + 1;
    }
}

module.exports = CPU;
