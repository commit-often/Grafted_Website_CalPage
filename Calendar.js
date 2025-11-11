<!-- FullCalendar CSS -->
<link href='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.css' rel='stylesheet' />

<!-- FullCalendar JS -->
<script src='https://cdn.jsdelivr.net/npm/fullcalendar@5.11.3/main.min.js'></script>

<!-- Calendar Container -->
<div id='hebrew-calendar' style='max-width: 1100px; margin: 40px auto;'></div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('hebrew-calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,listYear'
    },
    events: function(info, successCallback, failureCallback) {
      // Fetch from Hebcal API
      var year = info.start.getFullYear();
      fetch('https://www.hebcal.com/hebcal?v=1&cfg=json&year=' + year + '&maj=on&min=on&nx=on&mf=on&ss=on&mod=on&lg=s&s=on')
        .then(response => response.json())
        .then(data => {
          var events = data.items.map(item => {
            var eventColor = '#95a5a6'; // Default gray
            var eventUrl = null;
            
            // Color code by category
            if (item.category === 'holiday') {
              eventColor = '#e74c3c'; // Red for holidays
            } else if (item.category === 'parashat') {
              eventColor = '#3498db'; // Blue for Torah portions
            } else if (item.category === 'candles') {
              eventColor = '#f39c12'; // Orange for candle lighting
            } else if (item.category === 'havdalah') {
              eventColor = '#9b59b6'; // Purple for havdalah
            }
            
            // Add clickable link if available
            if (item.link) {
              eventUrl = item.link;
            }
            
            return {
              title: item.title,
              start: item.date,
              allDay: true,
              color: eventColor,
              url: eventUrl, // Makes the event clickable!
              extendedProps: {
                hebrew: item.hebrew || '',
                category: item.category || '',
                memo: item.memo || ''
              }
            };
          });
          successCallback(events);
        })
        .catch(error => {
          console.error('Error fetching Hebcal data:', error);
          failureCallback(error);
        });
    },
    
    // Open links in new tab
    eventClick: function(info) {
      if (info.event.url) {
        window.open(info.event.url, '_blank');
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
      
      if (info.event.url) {
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
</style>