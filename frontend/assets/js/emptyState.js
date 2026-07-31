// ======================================================
// Empty State
// ======================================================

function emptyState(

    icon,

    title,

    description

){

    return `

        <div class="text-center py-5">

            <i class="bi ${icon} fs-1 text-secondary"></i>

            <h5 class="mt-3">

                ${title}

            </h5>

            <p class="text-muted">

                ${description}

            </p>

        </div>

    `;

}