/**
 * Table Renderer
 * Handles rendering and updating the server status table
 */

class TableRenderer {
    constructor() {
        this.tableBody = document.getElementById('server-table-body');
        this.tableContainer = document.getElementById('table-container');
        this.loading = document.getElementById('loading');
        this.errorMessage = document.getElementById('error-message');
        
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.currentData = [];
        
        this.initializeEventListeners();
    }

    /**
     * Initialize event listeners for table interactions
     */
    initializeEventListeners() {
        // Add sort functionality to table headers
        const sortableHeaders = document.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', (e) => {
                const column = e.target.getAttribute('data-column');
                this.sortTable(column);
            });
        });
    }

    /**
     * Render server data in the table
     */
    renderTable(serverData) {
        if (!Array.isArray(serverData) || serverData.length === 0) {
            this.showError('No server data available');
            return;
        }

        this.currentData = [...serverData];
        this.hideLoading();
        this.hideError();

        // Apply current sorting if any
        if (this.sortColumn) {
            this.applySorting();
        }

        // Clear existing rows
        this.tableBody.innerHTML = '';

        // Generate table rows
        this.currentData.forEach((server, index) => {
            const row = this.createTableRow(server, index);
            this.tableBody.appendChild(row);
        });

        // Show table
        this.tableContainer.style.display = 'block';
        this.tableContainer.classList.add('fade-in');
    }

    /**
     * Create a table row for a server
     */
    createTableRow(server, index) {
        const row = document.createElement('tr');
        row.classList.add('slide-in');
        row.style.animationDelay = `${index * 50}ms`;

        const statusBadge = this.createStatusBadge(server.status, server.error);
        const scoreDisplay = this.createScoreDisplay(server.alliesScore, server.axisScore);
        
        row.innerHTML = `
            <td class="server-name">
                <strong>${this.escapeHtml(server.name)}</strong>
                ${server.description ? `<br><small>${this.escapeHtml(server.description)}</small>` : ''}
            </td>
            <td class="allies-count player-count">${server.allies || 0}</td>
            <td class="axis-count player-count">${server.axis || 0}</td>
            <td class="game-time">${server.gameTime || '00:00'}</td>
            <td class="score-display">${scoreDisplay}</td>
            <td class="map-name">${this.escapeHtml(server.currentMap || 'Unknown')}</td>
            <td class="map-name">${this.escapeHtml(server.nextMap || 'Unknown')}</td>
            <td>${statusBadge}</td>
        `;

        return row;
    }

    /**
     * Create status badge element
     */
    createStatusBadge(status, error) {
        const badge = document.createElement('span');
        badge.classList.add('status-badge');
        
        switch (status) {
            case 'online':
                badge.classList.add('status-online');
                badge.textContent = 'Online';
                break;
            case 'offline':
                badge.classList.add('status-offline');
                badge.textContent = 'Offline';
                if (error) {
                    badge.title = `Error: ${error}`;
                }
                break;
            default:
                badge.classList.add('status-error');
                badge.textContent = 'Error';
                if (error) {
                    badge.title = `Error: ${error}`;
                }
        }

        return badge.outerHTML;
    }

    /**
     * Create score display
     */
    createScoreDisplay(alliesScore, axisScore) {
        const allies = Math.max(0, Math.min(5, alliesScore || 0));
        const axis = Math.max(0, Math.min(5, axisScore || 0));
        
        return `<span class="allies-count">${allies}</span>/<span class="axis-count">${axis}</span>`;
    }

    /**
     * Sort table by column
     */
    sortTable(column) {
        if (this.sortColumn === column) {
            // Toggle direction if same column
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Update header indicators
        this.updateSortIndicators();

        // Apply sorting and re-render
        this.applySorting();
        this.renderTableBody();
    }

    /**
     * Apply current sorting to data
     */
    applySorting() {
        if (!this.sortColumn) return;

        this.currentData.sort((a, b) => {
            let aValue = this.getSortValue(a, this.sortColumn);
            let bValue = this.getSortValue(b, this.sortColumn);

            // Handle numeric sorting
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
            }

            // Handle string sorting
            aValue = String(aValue).toLowerCase();
            bValue = String(bValue).toLowerCase();

            if (this.sortDirection === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
    }

    /**
     * Get sortable value for a column
     */
    getSortValue(server, column) {
        switch (column) {
            case 'name':
                return server.name || '';
            case 'allies':
                return server.allies || 0;
            case 'axis':
                return server.axis || 0;
            case 'gameTime':
                return this.parseTimeForSorting(server.gameTime);
            case 'score':
                return (server.alliesScore || 0) + (server.axisScore || 0);
            case 'currentMap':
                return server.currentMap || '';
            case 'nextMap':
                return server.nextMap || '';
            default:
                return '';
        }
    }

    /**
     * Parse time string for sorting (convert to seconds)
     */
    parseTimeForSorting(timeString) {
        if (!timeString || typeof timeString !== 'string') return 0;
        
        const parts = timeString.split(':').map(part => parseInt(part, 10) || 0);
        
        if (parts.length === 3) {
            // HH:MM:SS
            return parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
            // MM:SS
            return parts[0] * 60 + parts[1];
        }
        
        return 0;
    }

    /**
     * Update sort indicators in table headers
     */
    updateSortIndicators() {
        const headers = document.querySelectorAll('.sortable');
        headers.forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
            
            if (header.getAttribute('data-column') === this.sortColumn) {
                header.classList.add(`sort-${this.sortDirection}`);
            }
        });
    }

    /**
     * Re-render table body without changing structure
     */
    renderTableBody() {
        this.tableBody.innerHTML = '';
        
        this.currentData.forEach((server, index) => {
            const row = this.createTableRow(server, index);
            this.tableBody.appendChild(row);
        });
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.loading.style.display = 'block';
        this.tableContainer.style.display = 'none';
        this.errorMessage.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        this.loading.style.display = 'none';
    }

    /**
     * Show error message
     */
    showError(message) {
        this.hideLoading();
        this.tableContainer.style.display = 'none';
        this.errorMessage.style.display = 'block';
        
        const errorContent = this.errorMessage.querySelector('p');
        if (errorContent) {
            errorContent.textContent = message;
        }
    }

    /**
     * Hide error message
     */
    hideError() {
        this.errorMessage.style.display = 'none';
    }

    /**
     * Update table with new data (smooth transition)
     */
    updateTable(serverData) {
        if (!Array.isArray(serverData) || serverData.length === 0) {
            this.showError('No server data available');
            return;
        }

        // Store previous data for comparison
        const previousData = new Map();
        this.currentData.forEach(server => {
            previousData.set(server.name, server);
        });

        this.currentData = [...serverData];
        
        // Apply sorting
        if (this.sortColumn) {
            this.applySorting();
        }

        // Update rows with change highlighting
        this.updateTableRows(previousData);
        
        this.hideError();
        this.tableContainer.style.display = 'block';
    }

    /**
     * Update table rows with change highlighting
     */
    updateTableRows(previousData) {
        this.tableBody.innerHTML = '';

        this.currentData.forEach((server, index) => {
            const row = this.createTableRow(server, index);
            const prevServer = previousData.get(server.name);
            
            // Highlight changes
            if (prevServer) {
                this.highlightChanges(row, server, prevServer);
            }
            
            this.tableBody.appendChild(row);
        });
    }

    /**
     * Highlight changes between current and previous data
     */
    highlightChanges(row, current, previous) {
        const cells = row.querySelectorAll('td');
        
        // Check for changes and add highlight class
        if (current.allies !== previous.allies) {
            cells[1].classList.add('data-changed');
        }
        if (current.axis !== previous.axis) {
            cells[2].classList.add('data-changed');
        }
        if (current.gameTime !== previous.gameTime) {
            cells[3].classList.add('data-changed');
        }
        if (current.alliesScore !== previous.alliesScore || current.axisScore !== previous.axisScore) {
            cells[4].classList.add('data-changed');
        }
        if (current.currentMap !== previous.currentMap) {
            cells[5].classList.add('data-changed');
        }
        if (current.nextMap !== previous.nextMap) {
            cells[6].classList.add('data-changed');
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Get current table data
     */
    getCurrentData() {
        return this.currentData;
    }

    /**
     * Clear table
     */
    clearTable() {
        this.tableBody.innerHTML = '';
        this.currentData = [];
        this.tableContainer.style.display = 'none';
    }
}

export default TableRenderer;