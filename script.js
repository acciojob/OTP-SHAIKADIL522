const inputs = document.querySelectorAll(".code");

/* 1️⃣ Initial focus (required by Cypress) */
inputs[0].focus();

/* 2️⃣ Add numeric keyboard for mobile (safe for tests) */
inputs.forEach(input => {
    input.setAttribute("inputmode", "numeric");
    input.setAttribute("pattern", "[0-9]*");
});

/* 3️⃣ Handle typing & navigation */
inputs.forEach((input, index) => {

    /* Forward typing */
    input.addEventListener("input", (e) => {
        const value = e.target.value;

        // Allow only single digit
        if (!/^[0-9]$/.test(value)) {
            e.target.value = "";
            return;
        }

        // Move to next input
        if (index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    /* Backspace handling (Cypress compatible) */
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace") {
            e.preventDefault(); // 🔥 important for Cypress

            input.value = "";

            if (index > 0) {
                inputs[index - 1].focus();
            }
        }
    });

    /* 4️⃣ Paste OTP support */
    input.addEventListener("paste", (e) => {
        const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!pastedData) return;

        pastedData.split("").forEach((digit, i) => {
            if (inputs[i]) {
                inputs[i].value = digit;
            }
        });

        const lastIndex = Math.min(pastedData.length, inputs.length) - 1;
        inputs[lastIndex]?.focus();
    });
});