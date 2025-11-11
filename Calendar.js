<!-- FullCalendar CSS -->
<link href='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css' rel='stylesheet' />

<!-- FullCalendar JS -->
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js'></script>

<!-- Hebcal Core Library -->
<script src='https://cdn.jsdelivr.net/npm/@hebcal/core@5.31.2/dist/hebcal.min.js'></script>

<!-- Calendar Container -->
<div id='hebrew-calendar'></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('hebrew-calendar');
  
  // Determine initial view based on screen size
  var initialView = 'dayGridMonth';
  var headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek,listYear'
  };
  
  // Mobile: use list view only
  if (window.innerWidth < 768) {
    initialView = 'listYear';
    headerToolbar = {
      left: 'prev,next today',
      center: 'title',
      right: ''
    };
  }
  
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: initialView,
    headerToolbar: headerToolbar,
    contentHeight: 500,
    
    datesSet: function(info) {
      console.log('Calendar dates set:', info.start, 'to', info.end);
    },
    
    events: function(info, successCallback, failureCallback) {
      try {
        console.log('Generating events for range:', info.start, 'to', info.end);
        
        // Use @hebcal/core library to generate events
        var startYear = info.start.getFullYear();
        var endYear = info.end.getFullYear();
        var allEvents = [];
        
        // Generate events for each year in the range
        for (var year = startYear; year <= endYear; year++) {
          var events = window.HebcalHDate.HebrewCalendar.calendar({
            year: year,
            isHebrewYear: false,
            noModern: false
          });
          
          console.log('Generated', events.length, 'events for year', year);
          
          // Convert Hebcal events to FullCalendar format
          events.forEach(function(item) {
            var eventColor = '#95a5a6'; // Default gray
            var flags = item.getFlags ? item.getFlags() : 0;
            
            // Color code by category based on event type
            if (item.constructor.name === 'HolidayEvent') {
              eventColor = '#e74c3c'; // Red for holidays
            } else if (item.constructor.name === 'ParshaEvent' || (flags & 0x08)) {
              eventColor = '#3498db'; // Blue for Torah portions
            } else if (item.constructor.name === 'CandleLightingEvent' || (flags & 0x20)) {
              eventColor = '#f39c12'; // Orange for candle lighting
            } else if (item.constructor.name === 'HavdalahEvent' || (flags & 0x40)) {
              eventColor = '#9b59b6'; // Purple for havdalah
            }
            
            var fcEvent = {
              title: item.render(),
              start: item.getDate().toISOString().split('T')[0],
              allDay: true,
              backgroundColor: eventColor,
              borderColor: eventColor,
              extendedProps: {
                category: item.constructor.name
              }
            };
            
            allEvents.push(fcEvent);
          });
        }
        
        console.log('Sending', allEvents.length, 'events to calendar');
        successCallback(allEvents);
      } catch (error) {
        console.error('Error generating Hebcal events:', error);
        failureCallback(error);
      }
    },
    
    // Open links in new tab
    eventClick: function(info) {
      if (info.event.extendedProps.link) {
        window.open(info.event.extendedProps.link, '_blank');
        info.jsEvent.preventDefault(); // Prevent default action
      }
    },
    
    // Show tooltip on hover
    eventMouseEnter: function(info) {
      var tooltip = document.createElement('div');
      tooltip.className = 'fc-event-tooltip';
      tooltip.innerHTML = '<strong>' + info.event.title + '</strong>';
      
      if (info.event.extendedProps.hebrew) {
        tooltip.innerHTML += '<br><span style="direction: rtl;">' + info.event.extendedProps.hebrew + '</span>';
      }
      
      if (info.event.extendedProps.memo) {
        tooltip.innerHTML += '<br><em>' + info.event.extendedProps.memo + '</em>';
      }
      
      if (info.event.extendedProps.link) {
        tooltip.innerHTML += '<br><small>Click to read more →</small>';
      }
      
      tooltip.style.cssText = 'position: absolute; z-index: 10000; background: white; padding: 10px; border: 2px solid ' + info.event.backgroundColor + '; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-size: 14px; max-width: 300px;';
      
      document.body.appendChild(tooltip);
      
      var rect = info.el.getBoundingClientRect();
      tooltip.style.top = (rect.top + window.scrollY - tooltip.offsetHeight - 10) + 'px';
      tooltip.style.left = (rect.left + window.scrollX) + 'px';
      
      info.el._tooltip = tooltip;
    },
    
    // Remove tooltip on mouse leave
    eventMouseLeave: function(info) {
      if (info.el._tooltip) {
        info.el._tooltip.remove();
        delete info.el._tooltip;
      }
    }
  });
  
  calendar.render();
  
  // Add legend
  var legend = document.createElement('div');
  legend.style.cssText = 'text-align: center; margin-top: 20px; font-size: 14px;';
  legend.innerHTML = `
    <div style="display: inline-flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
      <div><span style="display: inline-block; width: 15px; height: 15px; background: #3498db; border-radius: 3px; margin-right: 5px;"></span><strong>Torah Portions (Click to read)</strong></div>
      <div><span style="display: inline-block; width: 15px; height: 15px; background: #e74c3c; border-radius: 3px; margin-right: 5px;"></span>Holidays</div>
      <div><span style="display: inline-block; width: 15px; height: 15px; background: #f39c12; border-radius: 3px; margin-right: 5px;"></span>Candle Lighting</div>
      <div><span style="display: inline-block; width: 15px; height: 15px; background: #9b59b6; border-radius: 3px; margin-right: 5px;"></span>Havdalah</div>
    </div>
  `;
  calendarEl.parentNode.appendChild(legend);
});
</script>

<style>
/* Responsive container for calendar */
#hebrew-calendar {
  max-width: 1100px !important;
  margin: 40px auto;
  padding: 0 10px;
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s ease;
}

/* Hover effect - shadow color changes */
#hebrew-calendar:hover {
  box-shadow: 0 4px 15px rgba(168, 23, 16, 0.6);
}

/* Desktop: 1100px max width */
@media (min-width: 1024px) {
  #hebrew-calendar {
    max-width: 1100px !important;
  }
}

/* Tablet: 768px to 1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  #hebrew-calendar {
    max-width: 95% !important;
  }
}

/* Mobile: Below 768px */
@media (max-width: 767px) {
  #hebrew-calendar {
    max-width: 100% !important;
  }
  
  /* Reduce font sizes on mobile */
  .fc-toolbar {
    flex-direction: column;
    gap: 10px;
  }
  
  .fc-toolbar-chunk {
    width: 100%;
    text-align: center;
  }
  
  .fc-button-group {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .fc-button {
    padding: 0.4em 0.6em !important;
    font-size: 0.75em !important;
  }
  
  .fc-daygrid-day-number {
    font-size: 0.8em;
  }
  
  .fc-event-title {
    font-size: 0.75em;
  }
  
  /* Reduce font size for list view on mobile */
  .fc-list-event-title {
    font-size: 0.85em !important;
  }
  
  .fc-col-header-cell {
    font-size: 0.8em !important;
  }
}

/* Custom styling for calendar */
.fc-event {
  cursor: pointer !important;
  transition: transform 0.2s;
}

.fc-event:hover {
  transform: scale(1.05);
}

.fc-daygrid-event {
  white-space: normal !important;
  padding: 2px 4px;
}

/* Make sure event text is readable */
.fc-event-title {
  font-weight: 600;
}

/* Responsive legend */
@media (max-width: 767px) {
  .fc-event-tooltip {
    max-width: 200px !important;
    font-size: 12px !important;
  }
}
</style>