const promptInput = document.getElementById("prompt");

const generateBtn = document.getElementById("generateBtn");

const loading = document.getElementById("loading");

const imageGallery = document.getElementById("imageGallery");

const resultSection = document.getElementById("resultSection");

const themeToggle = document.getElementById("themeToggle");


// Random Prompts

const randomPrompts = [
    "A futuristic city with flying cars and neon lights, cinematic lighting",
    "A beautiful girl standing in a magical forest, fantasy art",
    "A cute astronaut cat exploring the moon, digital art",
    "A peaceful Japanese garden with cherry blossoms, ultra realistic",
    "A futuristic robot walking through a cyberpunk city",
    "A beautiful mountain landscape during golden hour",
    "A magical castle floating above the clouds"
];

document.getElementById("randomPrompt").addEventListener("click", () => {

    const randomIndex = Math.floor(Math.random() * randomPrompts.length);

    promptInput.value = randomPrompts[randomIndex];

});


// Aspect Ratio

function getDimensions(ratio) {

    const dimensions = {
        "1:1": [1024, 1024],
        "16:9": [1280, 720],
        "9:16": [720, 1280],
        "4:3": [1200, 900]
    };

    return dimensions[ratio];

}


// Generate Images

generateBtn.addEventListener("click", async () => {

    const prompt = promptInput.value.trim();

    const count = Number(document.getElementById("imageCount").value);

    const model = document.getElementById("model").value;

    const ratio = document.getElementById("aspectRatio").value;

    if (!prompt) {

        alert("Please enter a prompt first!");

        promptInput.focus();

        return;

    }

    const [width, height] = getDimensions(ratio);

    // Show Loading

    loading.classList.remove("hidden");

    generateBtn.disabled = true;

    generateBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Generating...
    `;

    imageGallery.innerHTML = "";

    resultSection.style.display = "none";


    // Generate Multiple Images

    const promises = [];

    for (let i = 0; i < count; i++) {

        const seed = Math.floor(Math.random() * 1000000);

        const encodedPrompt = encodeURIComponent(prompt);

        const imageURL =
            `https://image.pollinations.ai/prompt/${encodedPrompt}` +
            `?width=${width}&height=${height}` +
            `&model=${model}&seed=${seed}&nologo=true`;

        promises.push(createImageCard(imageURL, i + 1));

    }

    try {

        const results = await Promise.all(promises);

        results.forEach(card => {

            imageGallery.appendChild(card);

        });

        resultSection.style.display = "block";

    } catch (error) {

        alert("Unable to generate images. Please try again.");

        console.error(error);

    } finally {

        loading.classList.add("hidden");

        generateBtn.disabled = false;

        generateBtn.innerHTML = `
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            Generate
        `;

    }

});


// Create Image Cards

function createImageCard(imageURL, number) {

    return new Promise((resolve) => {

        const card = document.createElement("div");

        card.className = "image-card";

        const img = document.createElement("img");

        img.alt = `Generated Image ${number}`;

        img.src = imageURL;

        img.onload = () => {

            const downloadBtn = document.createElement("button");

            downloadBtn.className = "download-btn";

            downloadBtn.innerHTML = `
                <i class="fa-solid fa-download"></i>
                Download Image
            `;

            downloadBtn.addEventListener("click", () => {

                downloadImage(imageURL, number);

            });

            card.appendChild(img);

            card.appendChild(downloadBtn);

            resolve(card);

        };

        img.onerror = () => {

            card.textContent = "Image generation failed. Please try again.";

            resolve(card);

        };

    });

}


// Download Image

async function downloadImage(url, number) {

    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Image download failed");
        }

        const blob = await response.blob();

        const blobURL = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = blobURL;

        link.download = `AI-Generated-Image-${number}.png`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(blobURL);

    } catch (error) {

        alert("Download failed. Please try again.");

        console.error(error);

    }

}


// Dark / Light Mode

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';

});