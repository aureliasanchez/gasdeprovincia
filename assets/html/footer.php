    <footer class="bg-dark text-light py-4 mt-5">
        <div class="container">
            <div class="row">
                <div class="col-12 col-md-4">
                    <h5>Contacto</h5>
                    <p>
                        <i class="bi bi-telephone"></i> 
                        <a href="tel:<?= htmlspecialchars($contact_phone) ?>" class="text-light">
                            <?= htmlspecialchars($contact_phone) ?>
                        </a>
                    </p>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>
    <script src="/assets/js/site.min.js" defer></script>
</body>
</html>