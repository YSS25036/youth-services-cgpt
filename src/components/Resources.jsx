// src/components/Resources.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const Resources = () => {
  const resources = {
    "Orientation / Kickoff": [
      {
        title: "Orientation Talk - Kickoff Slides",
        url: "https://docs.google.com/presentation/d/1DntxPqRrzDTzXRHroaMuGqLhtET33Ko4/edit?usp=sharing&ouid=114840259545542586734&rtpof=true&sd=true",
      },
      {
        title: "Volunteer Orientation Sheet",
        url: "https://docs.google.com/document/d/1OIm_8VrN4avMo7mC0Fc86EZD30eZZeHq/edit?usp=sharing&ouid=114840259545542586734&rtpof=true&sd=true",
      },
    ],
    "Ongoing Tracker / Submissions": [
      {
        title: "Volunteer Tracker",
        url: "https://docs.google.com/spreadsheets/d/1eU7EYoXtHwwN3W8FPy-KQ1AhHnAeF3qC/edit?usp=sharing&ouid=114840259545542586734&rtpof=true&sd=true",
      },
      {
        title: "Session Reports Submission Sheet",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdsMO1TGe6IP0v1Bwt1cXWwweVtAdnTZzcn7PfM_3zMe7eqig/viewform",
      },
    ],
    "Communications / Templates": [
      {
        title: "Intro Message to Parents",
        url: "https://docs.google.com/document/d/1Yr4eD_1ePtgGPiQ7AfTy3ylPHMuDLWAZ/edit?usp=sharing&ouid=114840259545542586734&rtpof=true&sd=true",
      },
      {
        title: "Session Planning Template",
        url: "https://docs.google.com/document/d/1M34bF7wBGTmV-4OLfSCd4AkDGlqA_Ep0/edit?usp=sharing&ouid=114840259545542586734&rtpof=true&sd=true",
      },
    ],
  };

  return (
    <div className="space-y-6">
      {Object.entries(resources).map(([category, links]) => (
        <Card key={category} className="shadow-sm border border-gray-200">
          <CardContent className="py-4">
            <h2 className="text-xl font-semibold text-orange-700 mb-2">{category}</h2>
            <ul className="list-disc list-inside space-y-1">
              {links.map((link) => (
                <li key={link.url}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Resources;

