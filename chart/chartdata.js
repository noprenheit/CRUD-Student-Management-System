


export const BarChartData = (studentData, className) => {
    console.log("\n\nstudentData5:\n", studentData)
    const gradesCount = {
        A: 0,
        B: 0,
        C: 0,
        D: 0,
        E: 0,
        F: 0
    };

    // Iterate over each student in the data
    studentData.forEach((student) => {
        // Check if the specified class exists for the student
        if (student.className === className) {
            // Extract the grade for the specified class
            const { grade } = student;

            // Update the grades count based on the grade obtained
            gradesCount[grade] += 1;

        }
    });
    console.log("\ngradesCount value:\n",gradesCount);
    return {
        labels: Object.keys(gradesCount),
        datasets: [
            {
                data: Object.values(gradesCount)
            }
        ]
    };
};


