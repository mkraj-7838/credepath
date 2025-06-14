const API_BASE_URL = "https://credepath-job.onrender.com/api"; // Your backend API URL

const jobListingsContainer = document.getElementById("jobListingsContainer");
const jobDetailsContainer = document.getElementById("jobDetailsContainer");
const paginationContainer = document.getElementById("paginationContainer");

// Detail elements
let detailCompanyLogo, detailCompanyName, detailCompanyVerified, detailJobTitle;
let detailJobPosted, detailExperience, detailLocation, detailSalary;
let detailSkillsRequired, detailKeyResponsibilities, detailRequiredQualifications;
let detailPreferredSkills, detailBenefits, detailAboutCompany;

let currentJobs = []; // To store fetched jobs
let selectedJobId = null; // Track the currently selected job
let currentPage = 1; // Track current page
let totalPages = 1; // Track total pages

// Function to reset job details panel to default state
function resetJobDetailsPanel() {
  jobDetailsContainer.innerHTML = `
    <div class="job-card animate-slide-in">
      <div class="job-header">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              id="detailCompanyLogo"
              src="./images/placeholder.png"
              alt="Company Logo"
              class="w-12 h-12 rounded"
            />
            <div>
              <h2 id="detailCompanyName" class="font-semibold text-lg">
                Select a job to view details
              </h2>
              <div id="detailCompanyVerified" class="flex items-center text-[#00CC83] text-sm gap-1 hidden">
                <img src="./images/verified.svg" alt="Verified" class="w-4 h-4" />
                Credepath Verified Company
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="job-content">
        <div class="job-section">
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h1 id="detailJobTitle" class="font-semibold text-xl"></h1>
            <p id="detailJobPosted" class="text-[12px] text-gray-500"></p>
          </div>
          <div class="job-meta">
            <div class="meta-item">
              <img src="./images/bag.svg" alt="Experience" class="meta-icon" />
              <span id="detailExperience"></span>
            </div>
            <div class="meta-item">
              <img src="./images/location.svg" alt="Location" class="meta-icon" />
              <span id="detailLocation"></span>
            </div>
            <div class="meta-item">
              <img src="./images/money.svg" alt="Salary" class="meta-icon" />
              <span id="detailSalary"></span>
            </div>
          </div>
          <div class="mt-4">
            <div class="font-medium mb-2">Skills Required:</div>
            <div id="detailSkillsRequired"></div>
          </div>
          <div class="flex items-center gap-3 mt-4">
            <button class="apply-button transition-all duration-200 transform hover:scale-105">Apply Now</button>
            <div class="flex gap-2">
              <button class="action-button transition-all duration-200 transform hover:scale-110" title="Save Job">
                <div class="meta-item">
                  <img src="./images/save.svg" alt="Save" class="meta-icon" />
                </div>
              </button>
              <button class="action-button transition-all duration-200 transform hover:scale-110" title="Not Interested">
                <div class="meta-item">
                  <img src="./images/not-interested.svg" alt="Not Interested" class="meta-icon" />
                </div>
              </button>
              <button class="action-button transition-all duration-200 transform hover:scale-110" title="Copy Link">
                <div class="meta-item">
                  <img src="./images/link.svg" alt="Copy Link" class="meta-icon" />
                </div>
              </button>
            </div>
          </div>
        </div>
        <div class="job-section">
          <h2 class="font-bold text-lg">Job Description</h2>
          <div class="sub-heading">Key Responsibilities</div>
          <ul id="detailKeyResponsibilities" class="text-gray-700 list-disc pl-5"></ul>
          <div class="sub-heading">Required Qualifications</div>
          <ul id="detailRequiredQualifications" class="text-gray-700 list-disc pl-5"></ul>
          <div class="sub-heading">Preferred Skills</div>
          <ul id="detailPreferredSkills" class="text-gray-700 list-disc pl-5"></ul>
          <div class="sub-heading">Benefits</div>
          <ul id="detailBenefits" class="text-gray-700 list-disc pl-5"></ul>
        </div>
        <div class="job-section">
          <h2 class="font-bold text-lg">About the Company</h2>
          <p id="detailAboutCompany" class="text-gray-700 mt-2"></p>
        </div>
        <a href="#" class="view-similar transition-colors duration-200">View Similar Jobs</a>
      </div>
    </div>
  `;
  
  // Rebind all detail elements after resetting
  detailCompanyLogo = document.getElementById("detailCompanyLogo");
  detailCompanyName = document.getElementById("detailCompanyName");
  detailCompanyVerified = document.getElementById("detailCompanyVerified");
  detailJobTitle = document.getElementById("detailJobTitle");
  detailJobPosted = document.getElementById("detailJobPosted");
  detailExperience = document.getElementById("detailExperience");
  detailLocation = document.getElementById("detailLocation");
  detailSalary = document.getElementById("detailSalary");
  detailSkillsRequired = document.getElementById("detailSkillsRequired");
  detailKeyResponsibilities = document.getElementById("detailKeyResponsibilities");
  detailRequiredQualifications = document.getElementById("detailRequiredQualifications");
  detailPreferredSkills = document.getElementById("detailPreferredSkills");
  detailBenefits = document.getElementById("detailBenefits");
  detailAboutCompany = document.getElementById("detailAboutCompany");

  // Rebind action button event listeners
  bindActionButtons();
}

// Helper function to create a pagination button
function createPaginationButton(content, pageNumber, isActive = false, isDisabled = false) {
  const button = document.createElement("button");
  button.className = `pagination-button ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
  button.textContent = content;
  button.disabled = isDisabled;
  
  if (pageNumber !== null) {
    button.addEventListener("click", async () => {
      currentPage = pageNumber;
      await fetchJobs(getCurrentFilters());
    });
  }
  
  return button;
}

// Function to render pagination buttons
function renderPagination(totalPages, currentPage) {
  paginationContainer.innerHTML = "";
  if (totalPages <= 1) return;

  // Previous button
  const prevButton = createPaginationButton("Previous", currentPage - 1, false, currentPage === 1);
  paginationContainer.appendChild(prevButton);

  // Always show first page
  paginationContainer.appendChild(createPaginationButton(1, 1, currentPage === 1));

  // Show ellipsis if needed
  if (currentPage > 3) {
    const ellipsis = document.createElement("span");
    ellipsis.className = "pagination-ellipsis";
    ellipsis.textContent = "...";
    paginationContainer.appendChild(ellipsis);
  }

  // Show pages around current page
  const startPage = Math.max(2, currentPage - 1);
  const endPage = Math.min(totalPages - 1, currentPage + 1);
  
  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.appendChild(createPaginationButton(i, i, i === currentPage));
  }

  // Show ellipsis if needed
  if (currentPage < totalPages - 2) {
    const ellipsis = document.createElement("span");
    ellipsis.className = "pagination-ellipsis";
    ellipsis.textContent = "...";
    paginationContainer.appendChild(ellipsis);
  }

  // Always show last page if different from first
  if (totalPages > 1) {
    paginationContainer.appendChild(createPaginationButton(totalPages, totalPages, currentPage === totalPages));
  }

  // Next button
  const nextButton = createPaginationButton("Next", currentPage + 1, false, currentPage === totalPages);
  paginationContainer.appendChild(nextButton);
}

// Function to get current filters from input fields
function getCurrentFilters() {
  const filters = {};
  const jobTitle = document.getElementById("jobTitleSearch").value.trim();
  const location = document.getElementById("locationSearch").value.trim();
  const salary = document.getElementById("salarySearch").value.trim();
  const filterLocation = document.getElementById("filterLocation").value;
  const filterExperience = document.getElementById("filterExperience").value;
  const filterSalary = document.getElementById("filterSalary").value;
  const filterFunction = document.getElementById("filterFunction").value;
  const filterIndustry = document.getElementById("filterIndustry").value;
  const filterJobType = document.getElementById("filterJobType").value;

  if (jobTitle) filters.search = jobTitle;
  if (filterLocation) {
    filters.location = filterLocation;
  } else if (location) {
    filters.location = location;
  }
  if (filterSalary) {
    filters.salary = filterSalary;
  } else if (salary) {
    filters.salary = salary;
  }
  if (filterExperience) filters.experience = filterExperience;
  if (filterFunction) filters.func = filterFunction;
  if (filterIndustry) filters.industry = filterIndustry;
  if (filterJobType) filters.jobType = filterJobType;
  
  // Always include current page in filters
  filters.page = currentPage;
  
  return filters;
}

// Function to fetch and display job listings
async function fetchJobs(filters = {}) {
  try {
    jobListingsContainer.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow" style="min-height: 150px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
        Loading jobs...
      </div>
    `;

    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.message || "Unknown error"
        }`
      );
    }
    
    const data = await response.json();
    currentJobs = data.jobs || [];
    totalPages = Math.max(1, data.totalPages || 1);
    currentPage = data.currentPage || 1;
    
    renderJobListings(currentJobs);
    renderPagination(totalPages, currentPage);
    
    // Auto-select first job if none selected
    if (currentJobs.length > 0 && !selectedJobId) {
      selectedJobId = currentJobs[0]._id;
      displayJobDetails(selectedJobId);
    } else if (currentJobs.length === 0) {
      jobDetailsContainer.innerHTML = `
        <div class="job-card animate-slide-in">
          <div class="job-header">
            <h2 class="font-semibold text-lg text-center py-8">No jobs found matching your criteria.</h2>
          </div>
        </div>
      `;
      selectedJobId = null;
    }
  } catch (error) {
    console.error("Error fetching jobs:", error);
    jobListingsContainer.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow" style="min-height: 150px; display: flex; align-items: center; justify-content: center; color: #dc2626;">
        Failed to load jobs: ${error.message}. Please try again later.
      </div>
    `;
    jobDetailsContainer.innerHTML = `
      <div class="job-card animate-slide-in">
        <div class="job-header">
          <h2 class="font-semibold text-lg text-center py-8 text-red-600">Error loading job details.</h2>
        </div>
      </div>
    `;
    selectedJobId = null;
    paginationContainer.innerHTML = "";
  }
}

// Function to render job listings in the left panel
function renderJobListings(jobs) {
  jobListingsContainer.innerHTML = "";
  
  if (jobs.length === 0) {
    jobListingsContainer.innerHTML = `
      <div class="bg-white p-4 rounded-lg shadow animate-fade-in" style="text-align: center; color: #6b7280;">
        No jobs found matching your criteria.
      </div>
    `;
    return;
  }

  jobs.forEach((job, index) => {
    const jobCard = document.createElement("div");
    jobCard.className = `bg-white p-4 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300 animate-fade-in ${
      job._id === selectedJobId ? "border-blue-500 border-2" : ""
    }`;
    jobCard.style.animationDelay = `${index * 0.05}s`;
    jobCard.dataset.jobId = job._id;

    const dicebearCompanyLogo = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(job.companyName)}&backgroundType=gradientLinear&radius=50`;
    
    jobCard.innerHTML = `
      <div class="flex items-start gap-4">
        <img src="${
          job.companyLogo || dicebearCompanyLogo
        }" alt="Company Logo" class="w-12 h-12 rounded object-contain" />
        <div class="flex-1">
          <div class="flex justify-between items-start">
            <h3 class="font-semibold text-lg">${job.jobTitle}</h3>
            <button class="text-gray-500 hover:text-gray-700">...</button>
          </div>
          <p class="text-gray-600 text-sm">${job.companyName}</p>
          <div class="job-meta text-[12px] text-gray-500 mt-2">
            <div class="meta-item">
              <img src="./images/bag.svg" alt="Experience" class="meta-icon" />
              <span>${job.experience}</span>
            </div>
            <div class="meta-item">
              <img src="./images/location.svg" alt="Location" class="meta-icon" />
              <span>${job.location}</span>
            </div>
            <div class="meta-item">
              <img src="./images/money.svg" alt="Salary" class="meta-icon" />
              <span>${job.salary}</span>
            </div>
          </div>
          ${
            job.isCredepathVerifiedJob
              ? `
            <div class="flex items-center text-[12px] text-[#00CC83] mt-2 gap-1">
              <img src="./images/verified.svg" alt="Verified" class="w-4 h-4" />
              Credepath Verified Job
            </div>
          `
              : ""
          }
          <button class="mt-4 text-blue-500 text-[12px] hover:text-blue-600 transition-colors duration-200 view-similar-job" data-job-id="${
            job._id
          }">
            View Similar Jobs
          </button>
        </div>
      </div>
    `;
    
    jobCard.addEventListener("click", () => {
      document.querySelectorAll(".job-listings .bg-white").forEach((c) => 
        c.classList.remove("border-blue-500", "border-2")
      );
      jobCard.classList.add("border-blue-500", "border-2");
      selectedJobId = job._id;
      displayJobDetails(job._id);
    });
    
    jobListingsContainer.appendChild(jobCard);
  });

  // Add event listeners for "View Similar Jobs" buttons
  document.querySelectorAll(".view-similar-job").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      alert(`Viewing similar jobs for: ${e.target.dataset.jobId}`);
    });
  });
}

// Function to display details of a selected job
async function displayJobDetails(jobId) {
  const job = currentJobs.find((j) => j._id === jobId);
  if (!job) {
    resetJobDetailsPanel();
    selectedJobId = null;
    return;
  }

  // Reset the panel to ensure proper structure
  resetJobDetailsPanel();

  try {
    const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const jobData = await response.json();
    const dicebearCompanyLogo = `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(job.companyName)}&backgroundType=gradientLinear&radius=50`;

    // Update job details
    detailCompanyLogo.src = jobData.companyLogo || dicebearCompanyLogo;
    detailCompanyName.textContent = jobData.companyName;
    detailCompanyVerified.classList.toggle("hidden", !jobData.isCredepathVerifiedCompany);
    detailJobTitle.textContent = jobData.jobTitle;
    detailJobPosted.textContent = `Posted ${jobData.postedDaysAgo} days ago · Over ${jobData.applicantsCount} applicants`;
    detailExperience.textContent = jobData.experience;
    detailLocation.textContent = jobData.location;
    detailSalary.textContent = jobData.salary;

    // Skills Required
    detailSkillsRequired.innerHTML = "";
    jobData.skillsRequired.forEach((skill) => {
      const span = document.createElement("span");
      span.className = "skill-chip";
      span.textContent = skill;
      detailSkillsRequired.appendChild(span);
    });

    // Key Responsibilities
    detailKeyResponsibilities.innerHTML = "";
    jobData.jobDescription.keyResponsibilities.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailKeyResponsibilities.appendChild(li);
    });

    // Required Qualifications
    detailRequiredQualifications.innerHTML = "";
    jobData.jobDescription.requiredQualifications.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailRequiredQualifications.appendChild(li);
    });

    // Preferred Skills
    detailPreferredSkills.innerHTML = "";
    jobData.jobDescription.preferredSkills.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailPreferredSkills.appendChild(li);
    });

    // Benefits
    detailBenefits.innerHTML = "";
    jobData.benefits.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      detailBenefits.appendChild(li);
    });

    // About Company
    detailAboutCompany.textContent = jobData.aboutCompany;
  } catch (error) {
    console.error("Error fetching job details:", error);
    jobDetailsContainer.innerHTML = `
      <div class="job-card animate-slide-in">
        <div class="job-header">
          <h2 class="font-semibold text-lg text-center py-8 text-red-600">Error loading job details.</h2>
        </div>
      </div>
    `;
  }
}

// Function to bind action button event listeners
function bindActionButtons() {
  document.querySelectorAll(".apply-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (selectedJobId) {
        alert(`Applying for job ID: ${selectedJobId}`);
      } else {
        alert("Please select a job first");
      }
    });
  });

  document.querySelectorAll(".action-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const title = e.currentTarget.title;
      if (title === "Save Job") {
        alert("Job saved to your profile!");
      } else if (title === "Not Interested") {
        alert("We'll show you fewer jobs like this");
      } else if (title === "Copy Link") {
        navigator.clipboard.writeText(window.location.href);
        alert("Job link copied to clipboard!");
      }
    });
  });
}

// Initial load of jobs when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Initial bind of detail elements
  resetJobDetailsPanel();
  
  // Initial job fetch
  fetchJobs();

  // Event listener for the "Find Jobs" button
  document.getElementById("findJobsButton").addEventListener("click", () => {
    currentPage = 1;
    fetchJobs(getCurrentFilters());
  });

  // Event listeners for filter dropdowns
  const filterElements = [
    "filterLocation", "filterExperience", "filterSalary",
    "filterFunction", "filterIndustry", "filterJobType"
  ];
  
  filterElements.forEach((id) => {
    document.getElementById(id).addEventListener("change", () => {
      currentPage = 1;
      fetchJobs(getCurrentFilters());
    });
  });

  // Allow Enter key to trigger search in input fields
  const searchInputs = ["jobTitleSearch", "locationSearch", "salarySearch"];
  searchInputs.forEach((id) => {
    document.getElementById(id).addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        currentPage = 1;
        fetchJobs(getCurrentFilters());
      }
    });
  });
});