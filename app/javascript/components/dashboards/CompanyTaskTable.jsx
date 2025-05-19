import React, { useState } from 'react';

const CompanyTaskTable = ({ data }) => {
  const [openIndexes, setOpenIndexes] = useState([]);

  if (!data || data.length === 0) {
    return <p>該当データがありません。</p>;
  }

  const toggleRow = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="w-full">
      <table className="w-full table-auto border border-gray-300 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border text-left">企業名</th>
            <th className="px-4 py-2 border text-center">タスク数</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <React.Fragment key={i}>
              <tr
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleRow(i)}
              >
                <td className="px-4 py-2 border">{row.name}</td>
                <td className="px-4 py-2 border text-center">{row.count}</td>
              </tr>

              {openIndexes.includes(i) && row.tasks?.length > 0 && (
                <tr>
                  <td colSpan={2} className="border bg-gray-50 px-4 py-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="px-2 py-1 border">タスク名</th>
                          <th className="px-2 py-1 border">期限</th>
                        </tr>
                      </thead>
                      <tbody>
                        {row.tasks.map((task, j) => (
                          <tr key={j}>
                            <td
                              className="px-2 py-1 border text-gray-800 break-words"
                              style={{ maxWidth: '200px' }}
                              title={task.title}
                            >
                              {task.title}
                            </td>
                            <td className="px-2 py-1 border whitespace-nowrap">
                              {task.due_date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyTaskTable;
