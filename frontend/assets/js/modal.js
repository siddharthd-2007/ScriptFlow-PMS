// ======================================================
// Bootstrap Modal Helpers
// ======================================================

function openModal(id) {

    const modal = new bootstrap.Modal(

        document.getElementById(id)

    );

    modal.show();

}

function closeModal(id) {

    bootstrap.Modal
        .getInstance(document.getElementById(id))
        ?.hide();

}