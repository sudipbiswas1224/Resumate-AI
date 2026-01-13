import {
  Briefcase,
  CompassIcon,
  Loader,
  Loader2,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import api from "../configs/api";

const ExperienceForm = ({ data, onChange }) => {
  const { token } = useSelector((state) => state.auth);
  const [generatingIndex, setGeneratingIndex] = useState(-1);
  /* adding experience */
  const addExperience = () => {
    const newExperience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false,
    };
    onChange([...data, newExperience]);
  };

  /* removing experience */
  const removeExperience = (ind) => {
    const updatedExperience = data.filter((_, i) => i !== ind);
    onChange(updatedExperience);
  };

  /* updating experience */
  const updateExperience = (ind, field, value) => {
    const updated = [...data];
    updated[ind] = { ...updated[ind], [field]: value };
    onChange(updated);
  };

  const generateDescription = async (index) => {
    setGeneratingIndex(index);
    const experience = data[index];
    const prompt = `enhance this job description${experience.description} for the position of ${experience.position} at ${experience.company}.`;

    try {
      const { data } = await api.post(
        "/api/ai/enhance-job-desc",
        { userContent: prompt },
        { headers: { Authorization: token } }
      );

      updateExperience(index, "description", data.enhancedContent);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGeneratingIndex(-1);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/*  left section */}
        <div>
          <h3 className="flex items-centergap-2 text-;g font-semibold">
            Professional Experience
          </h3>
          <p className="text-sm text-gay-500">Add your job experience</p>
        </div>

        {/* button  */}
        <button
          onClick={addExperience}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {" "}
          <Plus className="size-4" />
          Add Experience
        </button>
      </div>

      {data.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No work experience added yet.</p>
          <p className="text-sm">Click "Add Experience" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((exp, ind) => (
            <div
              key={ind}
              className="p-4 border border-gray-200 rounded-lg space-y-3"
            >
              <div className="flex justify-between items-start">
                {/* serial number */}
                <h4>Experience #{ind + 1} </h4>
                {/* delete button */}
                <button
                  onClick={() => removeExperience(ind)}
                  className="text-erd-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {/* inputs for the experience */}
              <div className="grid md:grid-cols-2 gap-3">
                {/* input for company name */}
                <input
                  value={exp.company || ""}
                  onChange={(e) =>
                    updateExperience(ind, "company", e.target.value)
                  }
                  type="text"
                  placeholder="Company Name"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                {/* input for position */}
                <input
                  value={exp.position || ""}
                  onChange={(e) =>
                    updateExperience(ind, "position", e.target.value)
                  }
                  type="text"
                  placeholder="Job Title"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                {/* input for start date */}
                <input
                  value={exp.start_date || ""}
                  onChange={(e) =>
                    updateExperience(ind, "start_date", e.target.value)
                  }
                  type="month"
                  className="px-3 py-2 text-sm rounded-lg"
                />

                {/* input for end date */}
                <input
                  value={exp.end_date || ""}
                  onChange={(e) =>
                    updateExperience(ind, "end_date", e.target.value)
                  }
                  type="month"
                  disabled={exp.is_current}
                  className="px-3 py-2 text-sm rounded-lg disabled:bg-gray-100"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exp.is_current || false}
                  onChange={(e) =>
                    updateExperience(
                      ind,
                      "is_current",
                      e.target.checked ? true : false
                    )
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Currently working here
                </span>
              </label>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="">Job Description</label>
                  <button
                    disabled={
                      generatingIndex === ind || !exp.position || !exp.company
                    }
                    onClick={() => generateDescription(ind)}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 trasition-colors diasbles:opacity-50"
                  >
                    {generatingIndex === ind ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    Enhance with AI
                  </button>
                </div>

                <textarea
                  value={exp.description || ""}
                  onChange={(e) =>
                    updateExperience(ind, "description", e.target.value)
                  }
                  rows={4}
                  className="w-full text-sm px-3 py-2 rounded-lg resize-none border"
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
