import React from 'react';

const Results = ({ data }) => {
  return (
    <div className="results">
      <h2>Document Analysis Results</h2>
      <table className="results-table">
        <tbody>
          <tr>
            <td><strong>Word Count:</strong></td>
            <td>{data.wordCount}</td>
          </tr>
          <tr>
            <td><strong>Character Count (with spaces):</strong></td>
            <td>{data.characterCountWithSpaces}</td>
          </tr>
          <tr>
            <td><strong>Character Count (without spaces):</strong></td>
            <td>{data.characterCountWithoutSpaces}</td>
          </tr>
          <tr>
            <td><strong>Sentence Count:</strong></td>
            <td>{data.sentenceCount}</td>
          </tr>
          <tr>
            <td><strong>Average Word Length:</strong></td>
            <td>{data.averageWordLength}</td>
          </tr>
        </tbody>
      </table>
      <h3>Top 20 Most Frequent Words</h3>
      <ul className="word-list">
        {data.top20Words.map((word, index) => (
          <li key={index}>{word.word}: {word.count}</li>
        ))}
      </ul>
    </div>
  );
};

export default Results;
