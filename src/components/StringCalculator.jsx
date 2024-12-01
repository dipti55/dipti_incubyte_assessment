import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';


const StringCalculator = () => {

  const [input,setInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const parseInput = (numbers) => {
    let delimiter = /,|\n/; // Default delimiters: comma or newline
    let customDelimiterMatch = numbers.match(/^\/\/(\[.*?\]|.)\n/);

    if (customDelimiterMatch) {
      const rawDelimiters = customDelimiterMatch[1];
      if (rawDelimiters.startsWith("[") && rawDelimiters.endsWith("]")) {
        // Multiple or long delimiters
        delimiter = new RegExp(
          rawDelimiters
            .slice(1, -1)
            .split("][")
            .map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) // Escape special chars
            .join("|")
        );
      } else {
        // Single-character delimiter
        delimiter = new RegExp(
          rawDelimiters.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );
      }
      numbers = numbers.slice(customDelimiterMatch[0].length); // Remove custom delimiter part
    }

    return numbers.split(delimiter);
  };



  const handleSubmit = (e)=>{
    e.preventDefault();
    setError("");
    try{
      const calculatedResult = add(input);
      setResult(calculatedResult);
    }catch (err){
      setError(err.message);
      setResult(null);

    }
  }


  const add = (numbers) =>{
    if(!numbers){
      return 0;
    }
    const nums = parseInput(numbers).map((n) => n.trim());
    const negatives = nums.filter((n) => n.startsWith("-"));
    if (negatives.length) {
      throw new Error(`Negatives not allowed: ${negatives.join(", ")}`);
    }

    return nums
      .map((n) => parseInt(n, 10))
      .filter((num) => !isNaN(num) && num <= 1000)
      .reduce((sum, num) => sum + num, 0);

  }
  return (
    <>
      <h3 className='header'>String Calculator</h3>
      <Form className='stringCalculator' onSubmit={handleSubmit}>
        
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Email Numbers:</Form.Label>
          <Form.Control as="textarea" rows={3} placeholder="Enter numbers with delimiters" onChange={(e)=>setInput(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" type="submit">Calculate</Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {result !== null && <p>Result: {result}</p>}
      </Form>
    </>
  );
};

export default StringCalculator;
