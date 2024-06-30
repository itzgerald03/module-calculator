import React, { useState, useEffect } from "react";
import Button from "./button";
import Input from "./input";

const LOCAL_STORAGE_KEY = "assessments";

function AssessmentManager() {
  // State for assessments
  const [assessments, setAssessments] = useState([]);

  // State for new assessment input
  const [newAssessment, setNewAssessment] = useState({
    name: "",
    weightage: 0,
    score: 0,
  });

  // State for editing assessment
  const [editingAssessment, setEditingAssessment] = useState(null);

  // Load assessments from localStorage on component mount
  useEffect(() => {
    const savedAssessments = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (savedAssessments) {
      setAssessments(savedAssessments);
    }
  }, []);

  // Save assessments to localStorage whenever assessments state changes
  useEffect(() => {
    if (assessments.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assessments));
    }
  }, [assessments]);

  // Handler to add a new assessment
  const handleAddAssessment = () => {
    const newAssessmentWithId = { ...newAssessment, id: assessments.length + 1 };
    setAssessments([...assessments, newAssessmentWithId]);
    setNewAssessment({ name: "", weightage: 0, score: 0 });
  };

  // Handler to set the assessment to be edited
  const handleEditAssessment = (assessment) => {
    setEditingAssessment(assessment);
  };

  // Handler to update an assessment
  const handleUpdateAssessment = () => {
    setAssessments(assessments.map((a) => (a.id === editingAssessment.id ? editingAssessment : a)));
    setEditingAssessment(null);
  };

  const handleDeleteAssessment = (id) => {
    // Filter out the assessment to delete
    const updatedAssessments = assessments.filter((a) => a.id !== id);
    // Update state
    setAssessments(updatedAssessments);
    // Update localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedAssessments));
  };
  // Function to calculate final grade
  const calculateFinalGrade = () => {
    const weightedScores = assessments.map((assessment) => assessment.score * (assessment.weightage / 100));
    const finalScore = weightedScores.reduce((acc, score) => acc + score, 0);
    let finalGrade;

    if (finalScore >= 80) finalGrade = "A";
    else if (finalScore >= 75) finalGrade = "B+";
    else if (finalScore >= 70) finalGrade = "B";
    else if (finalScore >= 65) finalGrade = "C+";
    else if (finalScore >= 60) finalGrade = "C";
    else if (finalScore >= 55) finalGrade = "D+";
    else if (finalScore >= 50) finalGrade = "D";
    else finalGrade = "F";

    return { finalGrade, finalScore };
  };

  // Calculate final grade and score
  const { finalGrade, finalScore } = calculateFinalGrade();

  return (
    <div className="bg-background p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">SP Module Grade Calculator</h2>
        <Button onClick={handleAddAssessment} className="bg-primary text-primary-foreground hover:bg-primary/80">
          Add Assessment
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-muted-foreground">
              <th className="px-4 py-2 text-left">Assignment Name</th>
              <th className="px-4 py-2 text-left">Weightage (%)</th>
              <th className="px-4 py-2 text-left">Score (%)</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((assessment) => (
              <tr key={assessment.id} className="border-b border-muted/20 hover:bg-muted/10">
                <td className="px-4 py-2">
                  {editingAssessment?.id === assessment.id ? (
                    <Input
                      type="text"
                      value={editingAssessment.name}
                      onChange={(e) => setEditingAssessment({ ...editingAssessment, name: e.target.value })}
                    />
                  ) : (
                    assessment.name
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingAssessment?.id === assessment.id ? (
                    <Input
                      type="number"
                      value={editingAssessment.weightage}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          setEditingAssessment({ ...editingAssessment, weightage: value });
                        }
                      }}
                    />
                  ) : (
                    `${assessment.weightage}%`
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingAssessment?.id === assessment.id ? (
                    <Input
                      type="number"
                      value={editingAssessment.score}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (!isNaN(value) && value >= 0 && value <= 100) {
                          setEditingAssessment({ ...editingAssessment, score: value });
                        }
                      }}
                    />
                  ) : (
                    `${assessment.score}%`
                  )}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  {editingAssessment?.id === assessment.id ? (
                    <>
                      <Button
                        onClick={handleUpdateAssessment}
                        className="bg-primary text-primary-foreground hover:bg-primary/80"
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingAssessment(null)}
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => handleEditAssessment(assessment)}
                        className="bg-primary text-primary-foreground hover:bg-primary/80"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteAssessment(assessment.id)}
                        className="bg-danger text-danger-foreground hover:bg-danger/80"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {editingAssessment === null && (
              <tr>
                <td className="px-4 py-2">
                  <Input
                    type="text"
                    value={newAssessment.name}
                    onChange={(e) => setNewAssessment({ ...newAssessment, name: e.target.value })}
                    placeholder="New Assessment Name"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    value={newAssessment.weightage}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        setNewAssessment({ ...newAssessment, weightage: value });
                      }
                    }}
                    placeholder="Weightage"
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    type="number"
                    value={newAssessment.score}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 100) {
                        setNewAssessment({ ...newAssessment, score: value });
                      }
                    }}
                    placeholder="Score"
                  />
                </td>
                <td className="px-4 py-2">
                  <Button onClick={handleAddAssessment} className="bg-primary text-primary-foreground hover:bg-primary/80">
                    Add
                  </Button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-bold">Final Grade</h3>
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold">{finalGrade}</div>
          <div className="text-4xl font-bold">{finalScore.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentManager;
